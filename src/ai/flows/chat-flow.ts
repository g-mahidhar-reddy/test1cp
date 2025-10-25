
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
  // Convert history to a string format for the prompt
  const historyString = input.history
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  const result = await chatFlow({
    history: historyString,
    message: input.message,
  });
  
  return result.text;
}

const chatPrompt = ai.definePrompt(
  {
    name: 'chatPrompt',
    // Input schema is now a simple object with strings
    input: { schema: z.object({
        history: z.string(),
        message: z.string(),
    }) },
    output: { schema: z.object({ text: z.string() }) },

    system: `You are PrashikshanConnect AI, a helpful and friendly AI assistant integrated into the PrashikshanConnect platform.

Your purpose is to assist users based on their role:
- **For Students:** Act as a career counselor. Provide advice on finding internships, improving their resumes, preparing for interviews, and developing new skills. You can answer questions about different career paths and what companies look for in candidates.
- **For Faculty:** Act as an administrative assistant. Help them understand how to manage Memoranda of Understanding (MoUs), track student progress, and generate reports on internship placements.
- **For Industry Partners:** Act as a recruitment assistant. Provide guidance on posting effective internship listings, finding the right candidates, and managing the application process.

Your tone should be professional, encouraging, and helpful. Always provide actionable advice.
Do not go off-topic. All your responses should be relevant to the PrashikshanConnect platform and the user's career development or administrative tasks.
Keep your answers concise and easy to understand.
`,
    // Use a static Handlebars-style prompt string.
    prompt: `Chat History:
{{{history}}}

New user message:
user: {{{message}}}
model:`,
  },
);


// Define the Genkit flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.object({
        history: z.string(),
        message: z.string(),
    }),
    outputSchema: z.object({ text: z.string() }),
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output || { text: "I'm sorry, I couldn't generate a response."};
  }
);
