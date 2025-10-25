
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, Send, Sparkles, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { chat } from '@/ai/flows/chat-flow';
import type { ChatInput, Message } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function ChatbotPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsPending(true);

    try {
      const chatInput: ChatInput = {
        history: messages,
        message: input,
      };
      const response = await chat(chatInput);
      
      const botMessage: Message = { role: 'model', content: response };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to get chat response:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem communicating with the chatbot. Please try again.",
      });
       // Do not restore user message on failure, as it's confusing. The error toast is enough.
    } finally {
      setIsPending(false);
    }
  };
  
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI Chatbot
        </CardTitle>
        <CardDescription>
          Your personal AI assistant. Ask me anything about career advice, internships, or skills.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
           <div className="p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center h-full">
                        <Sparkles className="h-10 w-10 text-primary mb-4" />
                        <p className="text-muted-foreground font-semibold">The conversation starts here. Send a message to begin!</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? 'justify-end' : '')}>
                    {msg.role === 'model' && (
                        <Avatar className="h-9 w-9 border">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
                                <Bot className="h-5 w-5 text-primary"/>
                            </div>
                        </Avatar>
                    )}
                     <div className={cn(
                        "max-w-lg rounded-lg px-4 py-3",
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                     )}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                     {msg.role === 'user' && user && (
                         <Avatar className="h-9 w-9 border">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
                ))}
                {isPending && (
                     <div className="flex items-start gap-4">
                         <Avatar className="h-9 w-9 border">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
                                <Bot className="h-5 w-5 text-primary"/>
                            </div>
                        </Avatar>
                         <div className="max-w-lg rounded-lg px-4 py-3 bg-muted flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
           </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input 
                id="message" 
                placeholder="Type your message..." 
                className="flex-1" 
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPending}
            />
            <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
