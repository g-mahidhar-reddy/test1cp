
'use server';

/**
 * @fileOverview An AI flow for parsing resumes to extract structured data.
 *
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A PDF resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ParseResumeOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of technical and soft skills extracted from the resume.'),
  experience: z
    .array(
      z.object({
        company: z.string().describe('The name of the company.'),
        role: z.string().describe('The job title or role.'),
        duration: z.string().describe('The duration of employment (e.g., "Jan 2022 - Present").'),
        summary: z.string().describe('A summary of responsibilities and achievements.'),
      })
    )
    .describe('A list of work experiences.'),
  education: z
    .array(
      z.object({
        institution: z.string().describe('The name of the educational institution.'),
        degree: z.string().describe('The degree or qualification obtained.'),
        year: z.string().describe('The year of graduation or period of study.'),
      })
    )
    .describe('A list of educational qualifications.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;


export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}


const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are an expert resume parser. Your task is to analyze the provided resume document and extract key information in a structured JSON format.

  Analyze the resume provided in the media.
  
  Resume Document: {{media url=resumeDataUri}}

  Extract the following information:
  1.  **Skills**: Identify all technical skills (e.g., programming languages, frameworks, tools) and soft skills (e.g., communication, teamwork).
  2.  **Experience**: For each job or internship, extract the company name, the role or job title, the duration of employment, and a brief summary of the responsibilities and achievements.
  3.  **Education**: For each educational entry, extract the institution name, the degree obtained, and the year of graduation or period of study.
  
  Return the extracted information strictly in the defined JSON output schema.
  `,
});


const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { skills: [], experience: [], education: [] };
  }
);
