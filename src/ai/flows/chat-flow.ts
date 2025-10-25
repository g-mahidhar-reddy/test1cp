
'use server';

/**
 * @fileOverview A simple chat flow for a conversational AI.
 *
 * - chat - A function to handle the chat interaction.
 * - ChatInput - The input type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ChatInput } from '@/lib/types';
import { ChatInputSchema } from '@/lib/types';


// The main exported function to be called from the UI
export async function chat(input: ChatInput): Promise<string> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt(
    {
      name: 'chatPrompt',
      input: { schema: z.object({
        history: z.any(), // Keep history flexible for now
        message: z.string(),
      })},
      // Let's rely on the default model and not specify output schema for basic chat
    },
    async (input) => {
        return {
            history: input.history,
            prompt: input.message,
        };
    }
  );

// Define the Genkit flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    
    const augmentedHistory = history.map(msg => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const response = await ai.generate({
        history: augmentedHistory,
        prompt: message,
    });

    return response.text;
  }
);
