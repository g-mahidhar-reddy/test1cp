# **App Name**: PrashikshanConnect

## Core Features:

- Role-Based Authentication: Secure login and signup using Firebase Authentication (email/Google) with role-based access control (student, faculty, industry).
- Internship Marketplace: Browse and filter verified internships from industry partners. Internships are stored and retrieved from Firestore.
- Application and Progress Tracking: Students can apply for internships and track their application status. Industry partners can manage applications and mark completion. Data stored in Firestore.
- MoU Management: Faculty/Admin can manage and track Memoranda of Understanding (MoUs) with companies, storing relevant documents in Firebase Storage and metadata in Firestore.
- Reports and Analytics Dashboard: Generate reports and analytics on internship progress and credits earned using data from Firestore.
- Automated Notifications: Real-time alerts and notifications for application deadlines and updates using Cloud Functions.
- AI-Powered Internship Recommendation: Generative AI analyzes student profiles and internship descriptions to recommend suitable matches; the LLM can decide to exclude internships based on past performance ratings, transforming this feature into a 'tool'.

## Style Guidelines:

- Primary color: A professional blue (#29ABE2) to convey trust and reliability, inspired by the academia-industry focus of the platform.
- Background color: Light gray (#F5F5F5), a slightly desaturated version of the primary color, creates a clean and modern backdrop.
- Accent color: A contrasting orange (#FF9800), analogous to the primary color but distinct in brightness and saturation, is used for calls to action and highlights.
- Font pairing: 'Inter' (sans-serif) for both headlines and body text, lending a modern and neutral aesthetic.
- Use a consistent set of icons from Material Design or Font Awesome to represent actions and categories.
- Modern dashboard layout with clear sections for internships, applications, and reports.
- Subtle transitions and animations for a smooth user experience. Use animations to indicate loading states and progress.