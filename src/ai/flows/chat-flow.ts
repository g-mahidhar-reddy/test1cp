
'use server';

/**
 * @fileOverview A simple chat flow for a conversational AI.
 *
 * - chat - A function to handle the chat interaction.
 * - ChatInput - The input type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ChatInput, Message } from '@/lib/types';
import { ChatInputSchema } from '@/lib/types';


// The main exported function to be called from the UI
export async function chat(input: ChatInput): Promise<string> {
  return chatFlow(input);
}

// Define the Genkit flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {

    const llm = ai.getModel('gemini-1.5-flash-latest');
    
    const augmentedHistory = history.map(msg => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const response = await llm.generate({
      // @ts-ignore - The history type from the SDK has a different structure
      history: augmentedHistory,
      prompt: message,
    });

    return response.text();
  }
);
