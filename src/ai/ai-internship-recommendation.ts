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
  internshipId: z.string().describe('The unique identifier for the internship.'),
  title: z.string().describe('The title of the internship.'),
  company: z.string().describe('The company offering the internship.'),
  description: z.string().describe('A detailed description of the internship role and responsibilities.'),
  skillsRequired: z.array(z.string()).describe('A list of skills required for the internship.'),
  interestsAligned: z.array(z.string()).describe('A list of interests that align with the internship.'),
  rating: z.number().optional().describe('Rating of the internship based on past performance.'),
});

export type Internship = z.infer<typeof InternshipSchema>;

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
  })
);

export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

const filterInternships = ai.defineTool({
  name: 'filterInternships',
  description: 'Filters a list of internships based on a relevance score threshold.',
  inputSchema: z.object({
    internships: z.array(InternshipSchema).describe('The list of internships to filter.'),
    relevanceThreshold: z.number().describe('The minimum relevance score for an internship to be included.'),
  }),
  outputSchema: z.array(InternshipSchema),
  async resolve(input) {
    return input.internships.filter(internship => {
      // Assuming relevanceScore is added to the internship object before this tool is called
      return (internship as any).relevanceScore >= input.relevanceThreshold;
    });
  },
});

// Define the prompt for recommending internships.
const recommendInternshipsPrompt = ai.definePrompt({
  name: 'recommendInternshipsPrompt',
  input: {schema: RecommendationInputSchema},
  output: {schema: RecommendationOutputSchema},
  tools: [filterInternships],
  prompt: `You are an AI assistant designed to recommend internships to students based on their profiles and internship descriptions.

  Given the following student profile:
  ```json
  {{studentProfile}}
  ```

  And the following list of internships:
  ```json
  {{internships}}
  ```

  Recommend the internships that are most relevant to the student. For each internship, calculate a relevance score based on how well the student's skills and interests align with the internship requirements and interests.

  Include a relevanceScore (0-1) in the result. 1 means perfect match, 0 means not relevant. Only return internships that have a relevanceScore > 0.2.
  Consider that the internships may have a 