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
  skills?: string[];
  certifications?: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
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
  appliedDate: string;
  feedback?: string;
  internshipDetails?: Internship; // denormalized for easier display
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
