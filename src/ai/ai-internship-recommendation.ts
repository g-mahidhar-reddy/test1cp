'use server';

/**
 * @fileOverview This file defines an AI-powered internship recommendation flow.
 *
 * It takes a student profile and a list of internships as input, and returns a
 * filtered list of internships that are most relevant to the student.
 *
 * - `recommendInternships` - The main function to trigger the recommendation flow.
 * - `RecommendationInput` - The input type for the `recommendInternships` function.
 * - `RecommendationOutput` - The output type for the `recommendInternships` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a student profile.
const StudentProfileSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  skills: z.array(z.string()).describe('A list of skills possessed by the student.'),
  interests: z.array(z.string()).describe('A list of the student’s interests.'),
  pastExperiences: z.string().describe('A description of the student’s past experiences.'),
  academicAchievements: z.string().describe('A summary of the student’s academic achievements.'),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;

// Define the schema for an internship.
const InternshipSchema = z.object({
  id: z.string().describe('The unique identifier for the internship.'),
  title: z.string().describe('The title of the internship.'),
  companyName: z.string().describe('The company offering the internship.'),
  description: z.string().describe('A detailed description of the internship role and responsibilities.'),
  requiredSkills: z.array(z.string()).describe('A list of skills required for the internship.'),
  credits: z.number().optional().describe('Number of credits for the internship.'),
  duration: z.string().optional().describe('Duration of the internship'),
  location: z.string().optional().describe('Location of the internship'),
  stipend: z.string().optional().describe('Stipend for the internship'),
  verified: z.boolean().optional().describe('Whether the internship is verified'),
  companyLogoUrl: z.string().optional().describe('URL of the company logo'),
  postedBy: z.string().optional().describe('ID of the user who posted the internship'),
});

// Define the input schema for the recommendation flow.
const RecommendationInputSchema = z.object({
  studentProfile: StudentProfileSchema.describe('The profile of the student.'),
  internships: z.array(InternshipSchema).describe('A list of available internships.'),
});

export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

// Define the output schema for the recommendation flow.
const RecommendationOutputSchema = z.array(
  InternshipSchema.extend({
    relevanceScore: z.number().describe('A score indicating the relevance of the internship to the student.'),
    reason: z.string().describe('A brief explanation of why this internship is recommended.'),
  })
);

export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

// Define the prompt for recommending internships.
const recommendInternshipsPrompt = ai.definePrompt({
  name: 'recommendInternshipsPrompt',
  input: {schema: RecommendationInputSchema},
  output: {schema: RecommendationOutputSchema},
  prompt: `You are an expert career counselor AI for students. Your task is to recommend internships to students based on their profile and the available internship descriptions.

  Analyze the provided student profile:
  - Skills: {{studentProfile.skills}}
  - Interests: {{studentProfile.interests}}
  - Past Experiences: {{studentProfile.pastExperiences}}
  - Academic Achievements: {{studentProfile.academicAchievements}}

  Now, evaluate the following list of available internships:
  {{internships}}

  For each internship, calculate a 'relevanceScore' from 0.0 to 1.0, where 1.0 is a perfect match. The score should be based on a holistic analysis of:
  1.  **Skill Match**: How well the student's skills align with the internship's required skills.
  2.  **Interest Alignment**: How well the internship's domain aligns with the student's interests.
  3.  **Experience Synergy**: How the student's past experiences and academic background might contribute to or benefit from this internship.

  In addition to the score, provide a short, compelling 'reason' (max 20 words) for each recommendation, highlighting the key matching factor (e.g., "Matches your expertise in Python and Data Science.").

  **Crucially, only return a list of internships that have a relevanceScore greater than 0.3.** Do not include internships that are a poor match. The final list should be sorted by relevanceScore in descending order.
  `,
});

// Define the flow that uses the prompt.
const recommendInternshipsFlow = ai.defineFlow(
  {
    name: 'recommendInternshipsFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async input => {
    const {output} = await recommendInternshipsPrompt(input);
    return output || [];
  }
);


// Export a wrapper function to be called from server components/actions.
export async function recommendInternships(
  input: RecommendationInput
): Promise<RecommendationOutput> {
  return recommendInternshipsFlow(input);
}
