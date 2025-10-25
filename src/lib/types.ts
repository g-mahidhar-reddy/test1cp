

import { z } from 'zod';

export type UserRole = 'student' | 'faculty' | 'industry';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  college?: string; // For students and faculty
  company?: string; // For industry partners
  phone?: string;
  branch?: string;
  semester?: number;
  gpa?: number;
  skills?: Skill[];
  certifications?: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface Skill {
    name: string;
    level?: string;
    type?: string;
}

export interface Internship {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  location: string;
  duration: string;
  stipend: string;
  description: string;
  requiredSkills: string[];
  credits: number;
  verified: boolean;
  postedBy: string; // Industry user ID
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected' | 'completed';

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedDate: any; // Can be a server timestamp
  feedback?: string;
  internshipDetails?: Partial<Internship>; // denormalized for easier display
  studentDetails?: Pick<User, 'id' | 'name' | 'email' | 'college' | 'avatarUrl'>; // denormalized
}

export interface MoU {
  id: string;
  college: string;
  company: string;
  validFrom: string;
  validTill: string;
  documentUrl: string;
  status: 'active' | 'expired' | 'pending';
}

export interface StatCardData {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
}

export interface Certificate {
  id: string;
  userId: string;
  certificateName: string;
  fileUrl: string;
  uploadedAt: any; // Firestore ServerTimestamp
}

export interface Recommendation {
    id: string;
    userId: string;
    type: 'internship' | 'skill' | 'mentor';
    recommendationId: string; // ID of the internship, skill, or mentor
    reason: string;
    status: 'pending' | 'accepted' | 'ignored';
}

export interface Feedback {
    id: string;
    recommendationId: string;
    userId: string;
    rating?: number; // e.g., 1-5
    comment?: string;
}

// Zod schemas for AI flows
export const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

export const ChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The chat history.'),
  message: z.string().describe('The user\'s latest message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;
    
