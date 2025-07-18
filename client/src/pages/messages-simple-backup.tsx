import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, Search, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  updated_at: string;
  participant_name?: string;
  participant_profile_image?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email?: string;
  account_type: string;
  profile_url?: string;
  profile_image?: string;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect if not logged in
  if (!user) {
    setLocation('/login');
    return <div>Redirecionando...</div>;
  }

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/messages/conversations'],
    enabled: !!user,
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages/conversations', selectedConversation, 'messages'],
    enabled: !!selectedConversation,
  });

  // Fetch participants for new chat
  const { data: participants } = useQuery({
    queryKey: ['/api/messages/participants'],
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      return await apiRequest(`/api/messages/conversations/${conversationId}/messages`, 'POST', { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations', selectedConversation, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations'] });
      setMessageContent('');
      toast({
        title: "Mensagem enviada",
        description: "Mensagem enviada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    },
  });

  // Start new conversation mutation
  const startConversationMutation = useMutation({
    mutationFn: async (participantId: string) => {
      return await apiRequest('/api/messages/conversations', 'POST', { participantId });
    },
    onSuccess: (data) => {
      setSelectedConversation(data.id);
      setIsNewChatOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations'] });
      if (isMobile) {
        setShowConversationList(false);
      }
    },
    onError: (error) => {
      console.error('Erro ao criar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a conversa.",
        variant: "destructive",
      });
    },
  });

  // Get conversation data
  const selectedConversationData = conversations?.find(
    (conv: Conversation) => conv.id === selectedConversation
  );

  // Filter participants
  const filteredParticipants = participants?.filter((participant: User) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle functions
  const handleSendMessage = () => {
    if (!selectedConversation || !messageContent.trim()) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation,
      content: messageContent.trim(),
    });
  };

  const handleStartConversation = (participantId: string) => {
    startConversationMutation.mutate(participantId);
  };

  const selectConversation = (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setSelectedConversation(conversationId);
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const backToConversations = () => {
    setShowConversationList(true);
    setSelectedConversation(null);
  };

  // Format functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ontem';
    } else if (days < 7) {
      return date.toLocaleDateString('pt-PT', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {isMobile && selectedConversation && !showConversationList ? (
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={backToConversations} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={selectedConversationData?.participant_profile_image} />
                <AvatarFallback>
                  {selectedConversationData?.participant_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedConversationData?.participant_name || 'Utilizador'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-2xl font-bold">Mensagens</h1>
        )}
        
        {(!isMobile || showConversationList) && (
          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {isMobile ? 'Nova' : 'Nova Conversa'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Iniciar Nova Conversa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar utilizadores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {filteredParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => handleStartConversation(participant.id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={participant.profile_image || participant.profile_url} />
                          <AvatarFallback>
                            {participant.first_name?.[0]}{participant.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{participant.name}</div>
                          <div className="text-sm text-gray-500">{participant.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className={`${isMobile ? 'h-[calc(100vh-80px)]' : 'flex h-[calc(100vh-120px)]'} bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700`}>
        {/* Conversations List */}
        <div className={`${
          isMobile 
            ? showConversationList ? 'block' : 'hidden'
            : 'w-1/3 border-r border-gray-200 dark:border-gray-700'
        }`}>
          {!isMobile && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conversas</h2>
            </div>
          )}
          <ScrollArea className="h-full">
            {conversations?.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nenhuma conversa encontrada
              </div>
            ) : (
              <div>
                {conversations?.map((conversation: Conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 ${
                      selectedConversation === conversation.id && !isMobile
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : ''
                    }`}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={conversation.participant_profile_image} />
                      <AvatarFallback>
                        {conversation.participant_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conversation.participant_name || 'Utilizador'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(conversation.last_message_time || conversation.updated_at)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-gray-500 truncate">
                          {conversation.last_message || 'Iniciar conversa'}
                        </div>
                        {conversation.unread_count && conversation.unread_count > 0 && (
                          <span className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div className={`${
          isMobile
            ? !showConversationList ? 'block' : 'hidden'
            : 'flex-1'
        } flex flex-col h-full`}>
          {selectedConversation ? (
            <>
              {/* Chat Header - Desktop only */}
              {!isMobile && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={selectedConversationData?.participant_profile_image} />
                      <AvatarFallback>
                        {selectedConversationData?.participant_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedConversationData?.participant_name || 'Utilizador'}
                      </div>
                      <div className="text-sm text-gray-500">Online</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Display */}
              <div className="flex-1 overflow-y-auto p-4 chat-background">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : !messages || messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Nenhuma mensagem ainda. Envie a primeira!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg message-bubble ${
                            message.sender_id === user?.id ? 'sent' : 'received'
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {formatTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-end space-x-2">
                  <Textarea
                    placeholder="Escreva sua mensagem..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="flex-1 min-h-[44px] max-h-32 resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim() || sendMessageMutation.isPending}
                    className="h-11 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-500 mb-4">
                  Selecione uma conversa para começar
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}