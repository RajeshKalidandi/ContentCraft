import MistralClient from '@mistralai/mistralai';

const client = new MistralClient(import.meta.env.VITE_GITHUB_TOKEN);

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateContent(messages: ChatMessage[], stream = false) {
  try {
    if (stream) {
      return await client.chatStream({
        model: 'mistral-small-latest',
        messages,
        maxTokens: 2000,
        temperature: 0.7,
      });
    }

    const response = await client.chat({
      model: 'mistral-small-latest',
      messages,
      maxTokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}