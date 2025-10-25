
'use server';

/**
 * @fileOverview An AI flow for extracting skills from a resume stored in Firebase Storage.
 *
 * - extractSkillsFromResume - A function that handles the resume parsing process.
 * - ExtractSkillsInput - The input type for the extractSkillsFromResume function.
 * - ExtractSkillsOutput - The return type for the extractSkillsFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getStorage, ref, getBytes } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Firebase Admin SDK initialization
if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
}

const ExtractSkillsInputSchema = z.object({
  filePath: z
    .string()
    .describe(
      "The full path to the resume PDF file in Firebase Storage. (e.g. 'resumes/userId/resume.pdf')"
    ),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of technical and soft skills extracted from the resume.'),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;


export async function extractSkillsFromResume(input: ExtractSkillsInput): Promise<ExtractSkillsOutput> {
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {
    schema: z.object({
      resumeDataUri: z.string()
    })
  },
  output: {schema: ExtractSkillsOutputSchema},
  prompt: `You are an expert resume parser. Your task is to analyze the provided resume document and extract a list of skills.

  Analyze the resume provided in the media.
  
  Resume Document: {{media url=resumeDataUri}}

  Extract the following information:
  1.  **Skills**: Identify all technical skills (e.g., programming languages, frameworks, tools) and soft skills (e.g., communication, teamwork).
  
  Return the extracted information strictly in the defined JSON output schema. Only return the skills, do not extract experience or education.
  `,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async (input) => {
    // 1. Download the file from Firebase Storage
    const bucket = getStorage().bucket();
    const fileRef = bucket.file(input.filePath);
    const fileBuffer = await fileRef.download();
    
    // 2. Convert to a Data URI
    const resumeDataUri = `data:application/pdf;base64,${fileBuffer[0].toString('base64')}`;

    // 3. Call the prompt
    const {output} = await prompt({ resumeDataUri });

    return output || { skills: [] };
  }
);
