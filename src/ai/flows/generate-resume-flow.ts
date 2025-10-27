
'use server';

/**
 * @fileOverview An AI flow for generating a resume from a user's profile.
 *
 * - generateResume - A function that handles the resume generation process.
 */

import { ai } from '@/ai/genkit';
import { 
  GenerateResumeInputSchema, 
  GenerateResumeOutputSchema, 
  type GenerateResumeInput, 
  type GenerateResumeOutput 
} from '@/lib/resume-types';


export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are an expert resume writer. Your task is to generate a professional, clean, and effective resume in Markdown format based on the provided user profile data.

**User Profile:**
- Name: {{profile.name}}
- Email: {{profile.email}}
- Phone: {{profile.phone}}
- LinkedIn: {{profile.linkedinUrl}}
- Portfolio: {{profile.portfolioUrl}}

**Education:**
- College: {{profile.college}}
- Branch: {{profile.branch}}
- Semester: {{profile.semester}}
- GPA: {{profile.gpa}}

**Skills:**
{{#each profile.skills}}
- {{this.name}}
{{/each}}

**Certifications:**
{{#each profile.certifications}}
- {{this}}
{{/each}}

---

**Instructions:**

1.  **Format:** Generate the output as a single, well-structured Markdown document.
2.  **Header:** Start with the user's name as a main heading, followed by their contact information (Email, Phone, LinkedIn, Portfolio) on separate lines.
3.  **Sections:** Create the following sections, if the data is available:
    - **Summary:** Write a brief, 2-3 sentence professional summary for the user based on their profile. Highlight their key strengths and career interests.
    - **Education:** List the user's educational background. Include college, branch, and GPA.
    - **Skills:** Create a list of skills. You can categorize them (e.g., Programming Languages, Frameworks, Tools, Soft Skills) if it makes sense based on the input.
    - **Certifications:** List any certifications provided.
    - **Projects:** (If portfolio URL is provided) Mention that projects can be viewed at the portfolio link. If not, omit this section.
4.  **Tone:** The tone should be professional, confident, and tailored to a student seeking internships.
5.  **Empty Fields:** If a piece of information is not provided (e.g., no phone number, no certifications), omit it or the entire section gracefully. Do not include empty lines or placeholders like "N/A".

**Return the final resume as a single string in the 'resumeMarkdown' field of the JSON output.**
  `,
});


const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { resumeMarkdown: "Could not generate resume. Please ensure your profile is complete." };
  }
);
