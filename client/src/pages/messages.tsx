import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { MessageCircle, Send, Search, Plus, ArrowLeft, Menu, Trash2, Reply, Check, CheckCheck, Bold, Type, X } from 'lucide-react';
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
  
  // Error boundary state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Mobile-specific error handling
  useEffect(() => {
    const handleError = (error: any) => {
      console.error('MessagesPage error:', error);
      setHasError(true);
      setErrorMessage(error.message || 'Erro desconhecido');
    };
    
    const handleUnhandledRejection = (event: any) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setErrorMessage('Erro de conexão');
    };
    
    // Add multiple error listeners for better mobile compatibility
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  // Reset error state
  const resetError = () => {
    setHasError(false);
    setErrorMessage('');
    queryClient.clear(); // Clear all cached queries
  };
  
  // Error fallback UI
  if (hasError) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Algo deu errado</h2>
          <p className="text-gray-600 mb-6">Houve um erro ao carregar as mensagens.</p>
          <button 
            onClick={resetError}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [swipedMessageId, setSwipedMessageId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Notification permission removed to prevent crashes

  // Redirect if not logged in
  if (!user) {
    setLocation('/login');
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/messages/conversations'],
    enabled: !!user,
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['/api/messages/conversations', selectedConversation, 'messages'],
    enabled: !!selectedConversation,
    retry: 1,
    retryDelay: 500,
    staleTime: 30000,
  });

  // Fetch participants for new chat
  const { data: participants } = useQuery({
    queryKey: ['/api/messages/participants'],
    enabled: !!user,
  });

  // Get selected conversation data with participant information
  const selectedConversationData = conversations?.find(c => c.id === selectedConversation);
  
  // Fetch complete participant data for profile images
  const participantId = selectedConversationData?.participant1_id === user?.id 
    ? selectedConversationData?.participant2_id 
    : selectedConversationData?.participant1_id;
  
  const { data: participantProfile } = useQuery({
    queryKey: ['/api/users', participantId],
    queryFn: async () => {
      if (!participantId) return null;
      const response = await fetch(`/api/users/${participantId}`);
      if (!response.ok) throw new Error('Failed to fetch participant');
      return response.json();
    },
    enabled: !!participantId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      return await apiRequest(`/api/messages/conversations/${conversationId}/messages`, 'POST', { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations', selectedConversation, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/unread-count'] });
      setMessageContent('');
      
      // Success toast
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

  // Delete message functionality removed to prevent crashes

  // Format message content with bold
  const formatMessageContent = (content: string) => {
    if (isBold) {
      return `**${content}**`;
    }
    return content;
  };

  // Handle text formatting
  const handleBoldToggle = () => {
    setIsBold(!isBold);
  };

  // Handle Enter key for send and Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize removed to prevent crashes

  // Auto-scroll to bottom on new messages - Mobile-safe version
  useEffect(() => {
    try {
      if (messagesEndRef.current && messages && messages.length > 0) {
        // Use setTimeout for mobile compatibility
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !messageContent.trim()) return;
    
    try {
      const formattedContent = formatMessageContent(messageContent.trim());
      
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversation,
        content: formattedContent,
      });
      
      setMessageContent('');
      setIsBold(false);
      setReplyingToMessage(null);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    }
  };

  // Removed swipe functionality that was causing issues

  const handleReply = (message: Message) => {
    setReplyingToMessage(message);
    setSwipedMessageId(null);
    textareaRef.current?.focus();
  };

  // Removed delete functionality that was causing issues

  // Simplified message rendering
  const renderMessageContent = (content: string) => {
    return content;
  };

  // Check if message is sent by current user
  const isMessageSent = (message: Message) => message.sender_id === user?.id;

  // Message status component
  const MessageStatus = ({ message }: { message: Message }) => {
    if (!isMessageSent(message)) return null;
    
    return (
      <span className={`message-status ${message.is_read ? 'read' : 'sent'}`}>
        {message.is_read ? (
          <CheckCheck className="h-3 w-3" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </span>
    );
  };

  const handleStartConversation = (participantId: string) => {
    startConversationMutation.mutate(participantId);
  };

  const selectConversation = (conversationId: string) => {
    console.log('Selecionando conversa:', conversationId);
    
    if (selectedConversation === conversationId) {
      console.log('Conversa já selecionada');
      return;
    }
    
    setSelectedConversation(conversationId);
    
    if (isMobile) {
      setShowConversationList(false);
    }
    
    console.log('Conversa selecionada com sucesso');
  };

  const backToConversations = () => {
    setShowConversationList(true);
    setSelectedConversation(null);
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



  // Handle error state with better mobile UX
  if (hasError) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-medium">
            Erro na página de mensagens
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {errorMessage || 'Ocorreu um erro inesperado'}
          </div>
          <Button onClick={resetError} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (conversationsLoading) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="text-center">Carregando conversas...</div>
      </div>
    );
  }

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

      <div className={`${isMobile ? 'h-[calc(100vh-180px)]' : 'flex h-[calc(100vh-200px)]'} bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700`}>
        {/* Conversations List - Responsive */}
        <div className={`${
          isMobile 
            ? showConversationList ? 'block' : 'hidden'
            : 'w-1/3 border-r border-gray-200'
        }`}>
          {!isMobile && (
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
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
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                      selectedConversation === conversation.id && !isMobile
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                    }`}
                    onClick={() => {
                      console.log('Clicando na conversa:', conversation.id);
                      selectConversation(conversation.id);
                    }}
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

        {/* Messages Area - Responsive */}
        <div className={`${
          isMobile
            ? !showConversationList ? 'block' : 'hidden'
            : 'flex-1'
        } flex flex-col h-full`}>
          {selectedConversation ? (
            <>
              {/* Chat Header - Desktop only */}
              {!isMobile && (
                <div className="p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
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
              
              {/* Error state for messages */}
              {messagesError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg m-4">
                  <p className="font-semibold">Erro ao carregar mensagens</p>
                  <p className="text-sm">Por favor, tente novamente ou contacte o suporte.</p>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 chat-background">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : messagesError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-red-600 mb-4">Erro ao carregar mensagens</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </div>
                ) : !messages || messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Nenhuma mensagem ainda. Envie a primeira!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message: Message) => {
                      try {
                        const isCurrentUser = message.sender_id === user?.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
                          >
                            {/* Avatar for received messages (left side) - Always show */}
                            {!isCurrentUser && (
                              <Avatar 
                                className="h-8 w-8 mb-1 cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => {
                                  // Create image modal for profile viewing
                                  const imageUrl = participantProfile?.profile_url || selectedConversationData?.participant_profile_image;
                                  if (imageUrl) {
                                    const modal = document.createElement('div');
                                    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                                    modal.innerHTML = `
                                      <div class="max-w-md max-h-[80vh] relative">
                                        <img src="${imageUrl}" alt="Perfil" class="w-full h-auto rounded-lg" />
                                        <button class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center">×</button>
                                      </div>
                                    `;
                                    document.body.appendChild(modal);
                                    modal.onclick = () => document.body.removeChild(modal);
                                  }
                                }}
                              >
                                <AvatarImage 
                                  src={participantProfile?.profile_url || selectedConversationData?.participant_profile_image} 
                                  alt="Perfil do participante"
                                />
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                  {participantProfile?.name?.[0]?.toUpperCase() || 
                                   selectedConversationData?.participant_name?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg message-bubble ${
                                isCurrentUser ? 'sent' : 'received'
                              }`}
                            >
                              <div className="whitespace-pre-wrap break-words">
                                {message.content || 'Mensagem sem conteúdo'}
                              </div>
                              <div className="text-xs opacity-75 mt-1">
                                {formatMessageTime(message.created_at)}
                              </div>
                            </div>
                            
                            {/* Avatar for sent messages (right side) - Always show */}
                            {isCurrentUser && (
                              <Avatar 
                                className="h-8 w-8 mb-1 cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => {
                                  // Create image modal for profile viewing
                                  const imageUrl = user?.profile_url || user?.profile_image;
                                  if (imageUrl) {
                                    const modal = document.createElement('div');
                                    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                                    modal.innerHTML = `
                                      <div class="max-w-md max-h-[80vh] relative">
                                        <img src="${imageUrl}" alt="Perfil" class="w-full h-auto rounded-lg" />
                                        <button class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center">×</button>
                                      </div>
                                    `;
                                    document.body.appendChild(modal);
                                    modal.onclick = () => document.body.removeChild(modal);
                                  }
                                }}
                              >
                                <AvatarImage 
                                  src={user?.profile_url || user?.profile_image} 
                                  alt="Meu perfil"
                                />
                                <AvatarFallback className="text-xs bg-green-100 text-green-600">
                                  {user?.name?.[0]?.toUpperCase() || 
                                   user?.first_name?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        );
                      } catch (error) {
                        console.error('Error rendering message:', error);
                        return (
                          <div key={message.id} className="text-red-500 text-sm p-2">
                            Erro ao exibir mensagem
                          </div>
                        );
                      }
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              

              
              {/* WhatsApp-style Message Input */}
              <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-end space-x-3 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-sm">
                  <Textarea
                    placeholder="Escreva uma mensagem..."
                    value={messageContent}
                    onChange={(e) => {
                      try {
                        setMessageContent(e.target.value);
                      } catch (error) {
                        console.error('Error in message input:', error);
                      }
                    }}
                    className="flex-1 border-none bg-transparent focus:ring-0 focus:outline-none shadow-none text-sm resize-none min-h-[20px] max-h-24 overflow-y-auto leading-tight"
                    rows={1}
                    style={{ 
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      lineHeight: '1.2'
                    }}
                    onKeyDown={(e) => {
                      try {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          // Regular Enter creates new line - allow default behavior
                          return;
                        }
                        if (e.key === 'Enter' && e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      } catch (error) {
                        console.error('Error in keydown handler:', error);
                      }
                    }}
                    onInput={(e) => {
                      // Auto-resize textarea based on content
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      const newHeight = Math.min(target.scrollHeight, 96);
                      target.style.height = newHeight + 'px';
                      
                      // Handle automatic line breaks for long text
                      const maxCharsPerLine = 50; // Adjust based on mobile screen
                      const lines = target.value.split('\n');
                      const hasLongLines = lines.some(line => line.length > maxCharsPerLine);
                      
                      if (hasLongLines) {
                        target.style.overflowWrap = 'break-word';
                        target.style.wordBreak = 'break-word';
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      try {
                        handleSendMessage();
                      } catch (error) {
                        console.error('Error in send button:', error);
                        toast({
                          title: "Erro",
                          description: "Erro ao enviar mensagem",
                          variant: "destructive"
                        });
                      }
                    }}
                    disabled={!messageContent.trim() || sendMessageMutation.isPending}
                    className="h-8 w-8 p-0 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md flex-shrink-0"
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