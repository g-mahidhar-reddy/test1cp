'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Copy, Check, FilePen, Wand2 } from 'lucide-react';
import React, { useState, useTransition, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { generateResume } from '@/ai/flows/generate-resume-flow';
import type { GenerateResumeInput } from '@/lib/resume-types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ResumePage() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [generatedResume, setGeneratedResume] = useState('');
  const [manualResume, setManualResume] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  const profileForResume = useMemo(() => {
    if (!user) return null;
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      linkedinUrl: user.linkedinUrl,
      portfolioUrl: user.portfolioUrl,
      college: user.college,
      branch: user.branch,
      semester: user.semester,
      gpa: user.gpa,
      skills: user.skills,
      certifications: user.certifications,
    };
  }, [user]);

  useEffect(() => {
    // Pre-fill manual resume from profile when user data is available
    if (profileForResume) {
        const initialMarkdown = `
# ${profileForResume.name || 'Your Name'}

**Email:** ${profileForResume.email || ''} | **Phone:** ${profileForResume.phone || ''} | **LinkedIn:** ${profileForResume.linkedinUrl || ''} | **Portfolio:** ${profileForResume.portfolioUrl || ''}

---

### Summary
A brief 2-3 sentence summary about you.

---

### Education
- **${profileForResume.college || 'Your College'}**
  - ${profileForResume.branch || 'Your Branch'}, Semester ${profileForResume.semester || 'N/A'}
  - GPA: ${profileForResume.gpa || 'N/A'}

---

### Skills
${profileForResume.skills?.map(skill => `- ${skill.name}`).join('\n') || '- Add your skills'}

---

### Certifications
${profileForResume.certifications?.map(cert => `- ${cert}`).join('\n') || '- Add your certifications'}

---

### Projects
- **Project Name**
  - *Description:* A brief description of your project.
  - *Tech Stack:* Technologies used.

---

### Experience
- **Company Name** | *Role* | *Dates*
  - Responsibility or achievement 1.
  - Responsibility or achievement 2.
`;
        setManualResume(initialMarkdown.trim());
    }
}, [profileForResume]);


  const handleGenerateResume = () => {
    if (!profileForResume) {
      toast({
        variant: 'destructive',
        title: 'Profile not loaded',
        description: 'Your profile data is not available yet. Please wait and try again.',
      });
      return;
    }

    startTransition(async () => {
      setGeneratedResume('');
      try {
        const input: GenerateResumeInput = {
          profile: profileForResume,
        };
        const result = await generateResume(input);
        setGeneratedResume(result.resumeMarkdown);
        toast({
          title: 'Resume Generated!',
          description: 'Your new AI-generated resume is ready below.',
        });
      } catch (error) {
        console.error('Failed to generate resume:', error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem generating your resume. Please try again.',
        });
      }
    });
  };
  
   const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setHasCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
      
       <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePen className="h-6 w-6"/>
                Manual Resume Builder
              </CardTitle>
              <CardDescription>
                  Create or edit your resume manually. Your data is pre-filled from your profile.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="form">Structured Form</TabsTrigger>
                    <TabsTrigger value="markdown">Raw Markdown</TabsTrigger>
                </TabsList>
                <TabsContent value="form" className="mt-4">
                  <div className="grid gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="manual-summary">Summary</Label>
                        <Textarea id="manual-summary" placeholder="A brief professional summary..." />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="manual-experience">Experience</Label>
                        <Textarea id="manual-experience" placeholder="- Company | Role | Dates&#10;  - Achievement 1" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="markdown" className="mt-4">
                    <div className="relative">
                        <Textarea
                            value={manualResume}
                            onChange={(e) => setManualResume(e.target.value)}
                            className="h-96 font-mono text-sm"
                            placeholder="Your resume in Markdown will appear here..."
                        />
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2"
                            onClick={() => handleCopyToClipboard(manualResume)}
                            >
                           {hasCopied ? <Check className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4"/>}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
          </CardContent>
           <CardFooter className="border-t px-6 py-4 flex justify-end">
                <Button>Save Manual Resume</Button>
            </CardFooter>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6"/>
            AI Resume Generator
          </CardTitle>
          <CardDescription>
            Generate a professional resume using the information from your profile. Keep
            your profile updated in the Settings page for the best results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click the button below to have our AI assistant generate a
            standardized, well-formatted resume based on your skills,
            experiences, and academic achievements.
          </p>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleGenerateResume} disabled={isPending || !user}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Resume
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {(isPending || generatedResume) && (
        <Card>
            <CardHeader>
                <CardTitle>Your Generated Resume</CardTitle>
                <CardDescription>
                    Here is the resume generated by our AI assistant, in Markdown format. You can copy it and use it anywhere.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isPending ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center min-h-[300px]">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground font-semibold">Our AI is crafting your resume...</p>
                    </div>
                ) : (
                    <div className="relative">
                        <Textarea
                            readOnly
                            value={generatedResume}
                            className="h-96 font-mono text-sm"
                            placeholder="Your generated resume will appear here..."
                        />
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2"
                            onClick={() => handleCopyToClipboard(generatedResume)}
                            >
                           {hasCopied ? <Check className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4"/>}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
