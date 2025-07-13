import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Send, Users, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  updated_at: string;
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

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participant1_id === user.id ? conversation.participant2_id : conversation.participant1_id;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredParticipants = participants?.filter((participant: User) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-red-600" />
            Mensagens
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comunique com outros utilizadores da plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova
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
                        placeholder="Pesquisar pessoas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {filteredParticipants?.map((participant: User) => (
                          <div
                            key={participant.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => handleStartConversation(participant.id)}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={participant.profile_url} />
                              <AvatarFallback>
                                {participant.first_name[0]}{participant.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{participant.name}</p>
                              <p className="text-sm text-gray-500 truncate">{participant.email}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {participant.account_type === 'service_provider' ? 'Prestador' : 'Utilizador'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {conversationsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">A carregar conversas...</p>
                    </div>
                  ) : conversations?.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma conversa ainda</p>
                      <p className="text-sm text-gray-400">Inicie uma nova conversa</p>
                    </div>
                  ) : (
                    conversations?.map((conversation: Conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conversation.id
                            ? 'bg-red-50 border-red-200 dark:bg-red-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {getOtherParticipant(conversation)[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              Conversa {conversation.id.slice(0, 8)}...
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(conversation.updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedConversation ? 'Mensagens' : 'Selecione uma conversa'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedConversation ? (
                <div className="space-y-4">
                  <ScrollArea className="h-96 border rounded-lg p-4">
                    <div className="space-y-4">
                      {messagesLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                          <p className="text-gray-500 mt-2">A carregar mensagens...</p>
                        </div>
                      ) : messages?.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhuma mensagem ainda</p>
                          <p className="text-sm text-gray-400">Envie a primeira mensagem</p>
                        </div>
                      ) : (
                        messages?.map((message: Message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender_id === user.id
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === user.id ? 'text-red-100' : 'text-gray-500'
                              }`}>
                                {formatDate(message.created_at)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escreva a sua mensagem..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageContent.trim() || sendMessageMutation.isPending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Bem-vindo às Mensagens
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Selecione uma conversa para começar a comunicar
                  </p>
                  <Button
                    onClick={() => setIsNewChatOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Conversa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}