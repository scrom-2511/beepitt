export interface Message {
  prompt: string;
  response: string;
}

export interface StreamParams {
  prompt: string;
  userID: number;
  chatID: string;
  conversationID: string;
}
