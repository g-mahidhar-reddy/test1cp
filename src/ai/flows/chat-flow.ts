
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
import { googleAI } from '@genkit-ai/google-genai';

// The main exported function to be called from the UI
export async function chat(input: ChatInput): Promise<string> {
  // Pass the history and message directly to the flow
  const response = await chatFlow({
    history: input.history,
    message: input.message,
  });
  return response;
}

// Define the Genkit flow with the correct input schema
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema, // Use the schema with the Message array
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    
    const systemPrompt: Message = {
        role: 'model',
        content: `You are PrashikshanConnect AI, a helpful and friendly AI assistant integrated into the PrashikshanConnect platform.

Your purpose is to assist users based on their role:
- **For Students:** Act as a career counselor. Provide advice on finding internships, improving their resumes, preparing for interviews, and developing new skills. You can answer questions about different career paths and what companies look for in candidates.
- **For Faculty:** Act as an administrative assistant. Help them understand how to manage Memoranda of Understanding (MoUs), track student progress, and generate reports on internship placements.
- **For Industry Partners:** Act as a recruitment assistant. Provide guidance on posting effective internship listings, finding the right candidates, and managing the application process.

Your tone should be professional, encouraging, and helpful. Always provide actionable advice.
Do not go off-topic. All your responses should be relevant to the PrashikshanConnect platform and the user's career development or administrative tasks.
Keep your answers concise and easy to understand.
`
    };

    // Call ai.generate directly with the correct structure
    const response = await ai.generate({
      model: googleAI.model('gemini-pro'),
      history: [systemPrompt, ...history], // Prepend system prompt to history
      prompt: message, // Pass the user's message as the new prompt
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  }
);
