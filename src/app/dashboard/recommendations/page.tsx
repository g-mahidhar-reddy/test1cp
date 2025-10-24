import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InternshipCard } from "@/components/internship-card";
import { mockInternships } from "@/lib/data";

// This component will be a server component in a real app,
// calling a server action to get AI recommendations.
// For now, it's a static page.

export default function RecommendationsPage() {
  const recommendedInternships = mockInternships.slice(0, 2);

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="font-semibold text-2xl md:text-3xl">AI Internship Recommendations</h1>
          <p className="text-muted-foreground">
            Get personalized internship suggestions based on your profile and skills.
          </p>
        </div>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Get New Recommendations
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
          {recommendedInternships.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {recommendedInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
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
