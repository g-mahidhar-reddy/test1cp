import type { User, Internship, Application, MoU } from '@/lib/types';

export const mockUsers: User[] = [
  { id: 'student1', name: 'Aarav Sharma', email: 'student1@example.com', role: 'student', college: 'IIT Bombay', avatarUrl: 'https://picsum.photos/seed/avatar1/200/200' },
  { id: 'faculty1', name: 'Dr. Priya Singh', email: 'faculty1@example.com', role: 'faculty', college: 'IIT Bombay', avatarUrl: 'https://picsum.photos/seed/avatar2/200/200' },
  { id: 'industry1', name: 'Rohan Gupta', email: 'industry1@example.com', role: 'industry', company: 'TechNova Solutions', avatarUrl: 'https://picsum.photos/seed/avatar3/200/200' },
];

export const mockInternships: Internship[] = [
  {
    id: 'internship1',
    title: 'Frontend Developer Intern',
    companyName: 'TechNova Solutions',
    companyLogoUrl: 'https://picsum.photos/seed/logo1/200/200',
    location: 'Remote',
    duration: '3 Months',
    stipend: '₹20,000/month',
    description: 'Work on our flagship product\'s frontend using React and TypeScript. Collaborate with a dynamic team to build new features.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    credits: 10,
    verified: true,
    postedBy: 'industry1',
  },
  {
    id: 'internship2',
    title: 'Data Science Intern',
    companyName: 'DataWiz Inc.',
    companyLogoUrl: 'https://picsum.photos/seed/logo2/200/200',
    location: 'Bangalore',
    duration: '6 Months',
    stipend: '₹25,000/month',
    description: 'Analyze large datasets to extract meaningful insights. Build predictive models using Python and popular ML libraries.',
    requiredSkills: ['Python', 'Pandas', 'Scikit-learn'],
    credits: 20,
    verified: true,
    postedBy: 'industry2',
  },
  {
    id: 'internship3',
    title: 'Backend Engineer Intern',
    companyName: 'CodeCrafters',
    companyLogoUrl: 'https://picsum.photos/seed/logo3/200/200',
    location: 'Pune',
    duration: '4 Months',
    stipend: '₹22,000/month',
    description: 'Develop and maintain server-side logic, define and maintain the central database, and ensure high performance.',
    requiredSkills: ['Node.js', 'Express', 'MongoDB'],
    credits: 15,
    verified: false,
    postedBy: 'industry3',
  },
    {
    id: 'internship4',
    title: 'Cloud Engineering Intern',
    companyName: 'InfraCloud',
    companyLogoUrl: 'https://picsum.photos/seed/logo4/200/200',
    location: 'Remote',
    duration: '3 Months',
    stipend: '₹28,000/month',
    description: 'Help manage and scale our cloud infrastructure on AWS. Work with technologies like Docker, Kubernetes, and Terraform.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes'],
    credits: 12,
    verified: true,
    postedBy: 'industry4',
  },
];

export const mockApplications: Application[] = [
  {
    id: 'app1',
    internshipId: 'internship1',
    studentId: 'student1',
    status: 'accepted',
    appliedDate: '2024-05-15',
    internshipDetails: mockInternships[0],
    studentDetails: { id: 'student1', name: 'Aarav Sharma', email: 'student1@example.com', college: 'IIT Bombay', avatarUrl: 'https://picsum.photos/seed/avatar1/200/200' },
  },
  {
    id: 'app2',
    internshipId: 'internship2',
    studentId: 'student1',
    status: 'pending',
    appliedDate: '2024-05-20',
    internshipDetails: mockInternships[1],
     studentDetails: { id: 'student1', name: 'Aarav Sharma', email: 'student1@example.com', college: 'IIT Bombay', avatarUrl: 'https://picsum.photos/seed/avatar1/200/200' },
  },
  {
    id: 'app3',
    internshipId: 'internship1',
    studentId: 'student2',
    status: 'shortlisted',
    appliedDate: '2024-05-18',
    internshipDetails: mockInternships[0],
    studentDetails: { id: 'student2', name: 'Isha Verma', email: 'student2@example.com', college: 'NIT Warangal', avatarUrl: 'https://picsum.photos/seed/avatar4/200/200' },
  },
];

export const mockMoUs: MoU[] = [
  { id: 'mou1', college: 'IIT Bombay', company: 'TechNova Solutions', validFrom: '2023-01-01', validTill: '2025-12-31', documentUrl: '#', status: 'active' },
  { id: 'mou2', college: 'IIT Bombay', company: 'DataWiz Inc.', validFrom: '2022-06-01', validTill: '2024-05-31', documentUrl: '#', status: 'expired' },
  { id: 'mou3', college: 'NIT Warangal', company: 'CodeCrafters', validFrom: '2024-03-15', validTill: '2026-03-14', documentUrl: '#', status: 'active' },
];
