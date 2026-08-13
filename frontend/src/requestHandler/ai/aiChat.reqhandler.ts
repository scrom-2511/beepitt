import { BACKEND_URL } from '@/config/app.config';

export const aiChatHandler = async (
  prompt: string,
  chatID: string,
  conversationID: string,
  onChunk: (chunk: string) => void
) => {
  const response = await fetch(`${BACKEND_URL}/user/aiChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, chatID, conversationID }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to connect to AI');
  }

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};
