'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InternshipCard } from '@/components/internship-card';
import { mockInternships } from '@/lib/data';
import { recommendInternships, type RecommendationInput, type RecommendationOutput, type StudentProfile } from '@/ai/ai-internship-recommendation';
import { useToast } from '@/hooks/use-toast';
import type { Internship, User } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';


export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationOutput>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const studentProfile: StudentProfile | null = useMemo(() => {
    if (!user) return null;

    // This is a placeholder for a more complex resume parsing logic.
    // For now, we'll construct the description from existing profile fields.
    const pastExperiences = `College: ${user.college || 'N/A'}\nBranch: ${user.branch || 'N/A'}\nSemester: ${user.semester || 'N/A'}`;
    const academicAchievements = `GPA: ${user.gpa || 'N/A'}`;

    return {
      studentId: user.id,
      skills: user.skills?.map(s => s.name) || [],
      interests: [], // This could be a new field in the user profile
      pastExperiences,
      academicAchievements,
    };
  }, [user]);

  const handleGetRecommendations = () => {
    if (!studentProfile) {
      toast({
        variant: "destructive",
        title: "Profile not loaded",
        description: "Your profile is not available yet. Please wait a moment and try again.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const input: RecommendationInput = {
          studentProfile: studentProfile,
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
        <Button onClick={handleGetRecommendations} disabled={isPending || !user}>
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
