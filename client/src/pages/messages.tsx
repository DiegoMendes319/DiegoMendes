import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Send, Search, Plus } from 'lucide-react';
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

  // Redirect if not logged in
  if (!user) {
    setLocation('/login');
    return null;
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
    },
    onError: () => {
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
      return await apiRequest('/api/messages/conversations', 'POST', { participant_id: participantId });
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations'] });
      setSelectedConversation(conversation.id);
      setIsNewChatOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a conversa.",
        variant: "destructive",
      });
    },
  });

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-PT', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    }
  };

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredParticipants = participants?.filter((participant: User) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const selectedConversationData = conversations?.find(
    (conv: Conversation) => conv.id === selectedConversation
  );

  if (conversationsLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Carregando conversas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Mensagens</h1>
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conversa
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
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleStartConversation(participant.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.profile_image || participant.profile_url} />
                        <AvatarFallback>
                          {participant.first_name?.[0]}{participant.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border">
        {/* Conversations List - WhatsApp style */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
          </div>
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
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                      selectedConversation === conversation.id
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={conversation.participant_profile_image} />
                      <AvatarFallback>
                        {conversation.participant_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900 truncate">
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
                          <Badge className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Messages Area - WhatsApp style */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedConversationData?.participant_profile_image} />
                    <AvatarFallback>
                      {selectedConversationData?.participant_name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedConversationData?.participant_name || 'Utilizador'}
                    </div>
                    <div className="text-sm text-gray-500">Online</div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  {messagesLoading ? (
                    <div className="text-center py-8">Carregando mensagens...</div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map((message: Message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_id === user?.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                              {formatMessageTime(message.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Escreva uma mensagem..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={sendMessageMutation.isPending}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim() || sendMessageMutation.isPending}
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p className="text-sm">Escolha uma conversa para começar a enviar mensagens</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}