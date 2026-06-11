import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiChatHandler } from '@/requestHandler/ai/aiChat.reqhandler';
import { getChatHistoryHandler } from '@/requestHandler/ai/getChatHistory.reqhandler';
import { getIssueByIdHandler } from '@/requestHandler/issues/getIssues/getIssueById.reqhandler';
import type { Issue } from '@/requestHandler/issues/getIssues/getOpenIssues.reqhandler';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatSolutionPage = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [issue, setIssue] = useState<Issue | null>(location.state?.issue || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingIssue, setIsFetchingIssue] = useState(!issue);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [chatID] = useState(() => `issue-${issueId}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasSentFirstMessage = useRef(false);
  const hasFetchedHistory = useRef(false);
  const hasFetchedIssue = useRef(false);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!issueId || hasFetchedIssue.current) return;
      hasFetchedIssue.current = true;
      try {
        const data = await getIssueByIdHandler(issueId);
        setIssue(data);
      } catch (error) {
        console.error('Failed to fetch issue:', error);
      } finally {
        setIsFetchingIssue(false);
      }
    };

    if (!issue) {
      fetchIssue();
    } else {
      setIsFetchingIssue(false);
    }
  }, [issueId, issue]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!issueId || hasFetchedHistory.current) return;
      hasFetchedHistory.current = true;
      try {
        const history = await getChatHistoryHandler(`issue-${issueId}`);
        if (history && history.length > 0) {
          setMessages(history);
          hasSentFirstMessage.current = true;
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setIsFetchingHistory(false);
      }
    };

    fetchHistory();
  }, [issueId]);

  useEffect(() => {
    if (issue && !isFetchingHistory && !hasSentFirstMessage.current) {
      hasSentFirstMessage.current = true;
      const prompt = `Help me to fix this issue:
Project: ${issue.projectName}
Environment: ${issue.environment}
Name: ${issue.name}
Description: ${issue.description || 'No description'}
${issue.filePath ? `File Path: ${issue.filePath}${issue.lineNumber ? `:${issue.lineNumber}` : ''}${issue.columnNumber ? `:${issue.columnNumber}` : ''}` : ''}`;

      handleSend(prompt);
    }
  }, [issue, isFetchingHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationID = crypto.randomUUID();
    let assistantMessageContent = '';

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      await aiChatHandler(text, chatID, conversationID, (chunk) => {
        assistantMessageContent += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessageContent,
          };
          return newMessages;
        });
      });
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingIssue || isFetchingHistory) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Issue not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full mx-auto px-4 sm:px-6 ">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/open-issues')} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 sm:p-6">
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-xl text-sm ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted/50 text-foreground rounded-tl-none border border-border/50'
                    }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <div className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={syntaxTheme}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-lg my-2 text-xs"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-xs font-mono`} {...props}>
                                  {children}
                                </code>
                              );
                            },
                            // Add padding to lists and other elements if needed
                            ul: ({ children }) => <ul className="list-disc ml-4 my-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-ordered ml-4 my-2">{children}</ol>,
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {isLoading && index === messages.length - 1 && !msg.content && (
                      <div className="flex gap-1 items-center h-4">
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-muted/20 border-t border-border/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Ask follow-up question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="bg-background border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl h-11"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-11 w-11 rounded-xl shrink-0">
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatSolutionPage;
