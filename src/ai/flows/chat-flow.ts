
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
  // Pass the history and message directly to the flow
  const response = await chatFlow(input);
  return response;
}

const systemPrompt = `You are PrashikshanConnect AI, a helpful and friendly AI assistant integrated into the PrashikshanConnect platform.

Your purpose is to assist users based on their role:
- **For Students:** Act as a career counselor. Provide advice on finding internships, improving their resumes, preparing for interviews, and developing new skills. You can answer questions about different career paths and what companies look for in candidates.
- **For Faculty:** Act as an administrative assistant. Help them understand how to manage Memoranda of Understanding (MoUs), track student progress, and generate reports on internship placements.
- **For Industry Partners:** Act as a recruitment assistant. Provide guidance on posting effective internship listings, finding the right candidates, and managing the application process.

Your tone should be professional, encouraging, and helpful. Always provide actionable advice.
Do not go off-topic. All your responses should be relevant to the PrashikshanConnect platform and the user's career development or administrative tasks.
Keep your answers concise and easy to understand.
`;

const chatPrompt = ai.definePrompt(
  {
    name: 'chatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: z.string() },
    system: systemPrompt,
    prompt: (input) => {
      // Create a history of messages for the prompt
      const history = input.history.map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }],
      }));

      // Add the latest user message
      const messages = [
        ...history,
        { role: 'user', content: [{ text: input.message }] },
      ];
      // @ts-ignore - Genkit's `definePrompt` can accept a function that returns messages
      return messages;
    },
  }
);


// Define the Genkit flow with the correct input schema
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await chatPrompt(input);
    return response.output || "I'm sorry, I couldn't generate a response.";
  }
);
