import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, TrendingUp, Bell, Bot } from 'lucide-react';

const features = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Verified Internships',
    description: 'Access a curated marketplace of verified internships from trusted industry partners.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: 'Progress Tracking',
    description: 'Students, faculty, and mentors can monitor internship progress and milestones in real-time.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'MoU Management',
    description: 'A centralized system for academic institutions to manage and track MoUs with companies.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Role-Based Dashboards',
    description: 'Customized dashboards for students, faculty, and industry partners for a tailored experience.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Recommendations',
    description: 'Our smart algorithm suggests the most suitable internships based on your profile and skills.',
  },
  {
    icon: <Bell className="h-8 w-8 text-primary" />,
    title: 'Automated Alerts',
    description: 'Never miss a deadline with automated notifications for applications and important dates.',
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="w-full bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need for Success
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            PrashikshanConnect provides a comprehensive suite of tools to streamline the internship process for everyone involved.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
