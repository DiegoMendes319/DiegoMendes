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
  
  // Catch errors
  useEffect(() => {
    const handleError = (error: any) => {
      console.error('MessagesPage error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  // Reset error state
  const resetError = () => {
    setHasError(false);
    window.location.reload();
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

  // Request notification permission
  useEffect(() => {
    if (user && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user]);

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

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return await apiRequest(`/api/messages/${messageId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations', selectedConversation, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/unread-count'] });
      toast({
        title: "Mensagem eliminada",
        description: "A mensagem foi eliminada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a mensagem.",
        variant: "destructive",
      });
    },
  });

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

  // Auto-resize textarea - optimized for mobile
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '20px';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 80; // Max height for mobile
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [messageContent]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Check for new messages and show notification
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender_id !== user?.id) {
        // Show push notification for new message
        if (Notification.permission === 'granted') {
          new Notification('Nova mensagem recebida', {
            body: lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : ''),
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'message-' + lastMessage.id // Prevent duplicate notifications
          });
        }
      }
    }
  }, [messages, user?.id]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !messageContent.trim()) return;
    
    let content = messageContent.trim();
    
    // Add reply prefix if replying to a message
    if (replyingToMessage) {
      const replyContent = replyingToMessage.content.length > 30 
        ? replyingToMessage.content.substring(0, 30) + "..."
        : replyingToMessage.content;
      content = `↩️ Resposta a: "${replyContent}"\n\n${content}`;
    }
    
    // Apply formatting
    content = formatMessageContent(content);
    
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversation,
        content: content,
      });
      
      // Clear reply and reset formatting only on success
      setReplyingToMessage(null);
      setIsBold(false);
      setMessageContent('');
      
    } catch (error) {
      console.error('Erro detalhado ao enviar mensagem:', error);
      // Message content is preserved for retry
    }
  };

  // Handle swipe to reply
  const handleSwipeStart = (e: React.TouchEvent, messageId: string) => {
    const startX = e.touches[0].clientX;
    const handleSwipeMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const diff = startX - currentX;
      
      if (diff > 50) { // Swipe left detected
        setSwipedMessageId(messageId);
        document.removeEventListener('touchmove', handleSwipeMove);
        document.removeEventListener('touchend', handleSwipeEnd);
      }
    };
    
    const handleSwipeEnd = () => {
      document.removeEventListener('touchmove', handleSwipeMove);
      document.removeEventListener('touchend', handleSwipeEnd);
    };
    
    document.addEventListener('touchmove', handleSwipeMove);
    document.addEventListener('touchend', handleSwipeEnd);
  };

  const handleReply = (message: Message) => {
    setReplyingToMessage(message);
    setSwipedMessageId(null);
    textareaRef.current?.focus();
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  // Render message with formatting and reply indicators
  const renderMessageContent = (content: string) => {
    // Check if this is a reply message
    if (content.includes('↩️ Resposta a:')) {
      const parts = content.split('\n\n');
      const replyPart = parts[0];
      const messagePart = parts.slice(1).join('\n\n');
      
      return (
        <div>
          <div className="text-xs opacity-75 mb-2 p-2 bg-black bg-opacity-20 rounded-lg border-l-2 border-white border-opacity-30">
            {replyPart}
          </div>
          <div className="message-text">
            {messagePart.split(/(\*\*.*?\*\*)/).map((part, index) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
              }
              return <span key={index}>{part}</span>;
            })}
          </div>
        </div>
      );
    }

    // Handle bold formatting for regular messages
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = content.split(boldRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
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

      <div className={`${isMobile ? 'h-[calc(100vh-80px)]' : 'flex h-[calc(100vh-120px)]'} bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700`}>
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
                            {formatMessageTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message Input - WhatsApp-like compact design */}
              <div className="message-input-mobile">
                {/* Reply indicator - more compact */}
                {replyingToMessage && (
                  <div className="mb-2 p-2 bg-blue-50 border-l-2 border-blue-500 rounded-r-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Reply className="h-3 w-3 text-blue-500" />
                        <span className="text-xs font-medium text-blue-700">
                          Responder
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingToMessage(null)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 truncate">
                      {replyingToMessage.content}
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  {/* Formatting button - very compact */}
                  <button
                    onClick={handleBoldToggle}
                    className={`message-button format ${isBold ? 'active' : ''}`}
                    title="Negrito"
                  >
                    <Bold className="h-3 w-3" />
                  </button>

                  {/* Input container - WhatsApp style */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-full px-3 py-2 flex items-center gap-2">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Mensagem..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={sendMessageMutation.isPending}
                      className="flex-1 border-0 bg-transparent resize-none text-sm min-h-[20px] max-h-[80px] p-0 focus:outline-none"
                      rows={1}
                    />
                  </div>

                  {/* Send button - compact and styled like WhatsApp */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim() || sendMessageMutation.isPending}
                    className="message-button send"
                    title="Enviar"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
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