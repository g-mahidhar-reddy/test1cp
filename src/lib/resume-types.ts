import { z } from 'zod';

const UserProfileSchema = z.object({
    name: z.string().optional().describe('Full name of the user.'),
    email: z.string().optional().describe('Email address of the user.'),
    phone: z.string().optional().describe('Phone number of the user.'),
    linkedinUrl: z.string().optional().describe('URL to the user\'s LinkedIn profile.'),
    portfolioUrl: z.string().optional().describe('URL to the user\'s personal portfolio or website.'),
    college: z.string().optional().describe('The user\'s college or university.'),
    branch: z.string().optional().describe('The user\'s academic branch or major.'),
    semester: z.number().optional().describe('The user\'s current semester.'),
    gpa: z.number().optional().describe('The user\'s Grade Point Average.'),
    skills: z.array(z.object({ name: z.string(), level: z.string().optional(), type: z.string().optional() })).optional().describe('A list of the user\'s skills.'),
    certifications: z.array(z.string()).optional().describe('A list of the user\'s certifications.'),
});

export const GenerateResumeInputSchema = z.object({
  profile: UserProfileSchema,
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

export const GenerateResumeOutputSchema = z.object({
  resumeMarkdown: z
    .string()
    .describe('The full resume formatted as a professional Markdown document.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;
