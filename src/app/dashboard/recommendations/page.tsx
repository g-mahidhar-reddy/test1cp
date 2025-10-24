'use client';

import React, { useState, useTransition } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InternshipCard } from '@/components/internship-card';
import { mockInternships } from '@/lib/data';
import { recommendInternships, type RecommendationInput, type RecommendationOutput, type StudentProfile } from '@/ai/ai-internship-recommendation';
import { useToast } from '@/hooks/use-toast';
import type { Internship } from '@/lib/types';


// Mock student profile - in a real app, this would be fetched from your database for the logged-in user.
const mockStudentProfile: StudentProfile = {
  studentId: 'student1',
  skills: ['React', 'TypeScript', 'Node.js', 'Firebase', 'Data Analysis'],
  interests: ['Web Development', 'Artificial Intelligence', 'Startups'],
  pastExperiences: 'Developed a full-stack web application for a university project using the MERN stack. Contributed to an open-source library for data visualization.',
  academicAchievements: 'Dean\'s List for two consecutive semesters. Published a paper on efficient sorting algorithms in the university journal. GPA: 3.8/4.0',
};


export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationOutput>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetRecommendations = () => {
    startTransition(async () => {
      try {
        const input: RecommendationInput = {
          studentProfile: mockStudentProfile,
          // Convert mockInternships to the schema expected by the AI flow
          internships: mockInternships.map(i => ({
            id: i.id,
            title: i.title,
            companyName: i.companyName,
            description: i.description,
            requiredSkills: i.requiredSkills,
            credits: i.credits,
            duration: i.duration,
            location: i.location,
            stipend: i.stipend,
            verified: i.verified,
            companyLogoUrl: i.companyLogoUrl,
            postedBy: i.postedBy,
          })),
        };
        const result = await recommendInternships(input);
        setRecommendations(result);
        toast({
          title: "Recommendations Ready!",
          description: `We found ${result.length} great opportunities for you.`,
        });
      } catch (error) {
        console.error("Failed to get recommendations:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem getting your recommendations. Please try again.",
        });
      }
    });
  };

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="font-semibold text-2xl md:text-3xl">AI Internship Recommendations</h1>
          <p className="text-muted-foreground">
            Get personalized internship suggestions based on your profile and skills.
          </p>
        </div>
        <Button onClick={handleGetRecommendations} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get New Recommendations
            </>
          )}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Top Picks For You
          </CardTitle>
          <CardDescription>
            Our AI has analyzed your profile and found these opportunities just for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-semibold">Finding the best internships for you...</p>
             </div>
          ) : recommendations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="relative">
                   <InternshipCard internship={rec as unknown as Internship} />
                   <div className="mt-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded-b-lg">
                    <strong>Reason:</strong> {rec.reason}
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
              <p className="text-muted-foreground">Click the button to get your first recommendations!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
