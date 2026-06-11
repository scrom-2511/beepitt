export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}
