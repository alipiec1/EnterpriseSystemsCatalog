import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Copy, User, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPromptProps {
  onSubmit?: (prompt: string) => Promise<string>;
  placeholder?: string;
  className?: string;
}

export default function ChatPrompt({ 
  onSubmit, 
  placeholder = "Ask me anything about your systems...",
  className = ""
}: ChatPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      // If onSubmit is provided, use it; otherwise use a default response
      let response: string;
      if (onSubmit) {
        response = await onSubmit(prompt);
      } else {
        response = generateMockResponse(prompt);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userPrompt: string): string => {
    // Simple mock response generator for demonstration
    const responses = [
      `I understand you're asking about: "${userPrompt}". Here's what I can tell you:\n\n• This is a comprehensive enterprise systems catalog\n• It helps track business, security, and technical stewards\n• You can manage system lifecycles and statuses\n• All data is stored securely with proper validation`,
      `Based on your query "${userPrompt}", here are some key insights:\n\n**System Management**\n- Create and track enterprise systems\n- Assign stewardship roles\n- Monitor system status and health\n\n**Best Practices**\n- Regular system audits\n- Clear stewardship assignments\n- Proper documentation`,
      `Regarding "${userPrompt}", here's what you should know:\n\n1. **Data Structure**: All systems have comprehensive metadata\n2. **Security**: Email validation and required fields ensure data integrity\n3. **Scalability**: JSON-based storage with API-first design\n4. **Testing**: Complete test coverage for all operations`
    ];
    
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex] || responses[0];
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    });
  };

  const formatContent = (content: string) => {
    // Simple formatting for demonstration
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={index} className="text-foreground">{line.slice(2, -2)}</strong>;
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={index} className="ml-4 text-muted-foreground">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={index} className="ml-4 text-muted-foreground">{line}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-muted-foreground">{line}</p>;
    });
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-4 ${className}`}>
      {/* Messages */}
      <div className="space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <div className={`flex items-start gap-4 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <Card className={`flex-1 ${
                message.role === 'user' ? 'bg-blue-50 dark:bg-blue-950' : 'bg-card'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {message.role === 'user' ? (
                      <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="space-y-2">
                        {formatContent(message.content)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Press Cmd/Ctrl + Enter to send
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={!prompt.trim() || isLoading}
                className="gap-2"
              >
                <Send size={16} />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}