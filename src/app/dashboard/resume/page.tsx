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
import { Loader2, Sparkles, Copy, Check, FilePen, Wand2, Download } from 'lucide-react';
import React, { useState, useTransition, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { generateResume } from '@/ai/flows/generate-resume-flow';
import type { GenerateResumeInput } from '@/lib/resume-types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// A simple Markdown renderer component
const MarkdownPreview = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    let html = text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 border-b pb-1">$1</h3>')
      .replace(/^\*\* (.*$)/gim, '<p class="font-bold">$1</p>')
      .replace(/\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/---/g, '<hr class="my-4"/>')
      .replace(/\|/g, '<span class="mx-2 text-muted-foreground">|</span>')
      .split('\n')
      .map(line => line.trim() === '' ? '' : `<p>${line}</p>`)
      .join('')
      .replace(/<p><h1/g, '<h1')
      .replace(/<\/h1><\/p>/g, '</h1>')
      .replace(/<p><h3/g, '<h3')
      .replace(/<\/h3><\/p>/g, '</h3>')
      .replace(/<p><hr/g, '<hr')
      .replace(/<\/hr><\/p>/g, '</h3>')
      .replace(/<p><li/g, '<li')
      .replace(/<\/li><\/p>/g, '</li>');
      
    return { __html: html };
  };

  return <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={renderMarkdown(content)} />;
};


export default function ResumePage() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [resumeMarkdown, setResumeMarkdown] = useState('');
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
    if (profileForResume) {
        const initialMarkdown = `
# ${profileForResume.name || 'Your Name'}

${profileForResume.email || ''} | ${profileForResume.phone || ''} | ${profileForResume.linkedinUrl || 'linkedin.com/in/your-profile'}

---

### Professional Summary
A brief 2-3 sentence summary about you. Aspiring Software Engineer with a passion for building innovative solutions.

---

### Education
- **${profileForResume.college || 'Your College'}** | ${profileForResume.branch || 'Your Branch'}
  - Current GPA: ${profileForResume.gpa || 'N/A'}
  - Expected Graduation: May 2025

---

### Skills
${profileForResume.skills?.map(skill => `- **${skill.type || 'General'}:** ${skill.name}`).join('\n') || '- Add your skills'}

---

### Certifications
${profileForResume.certifications?.map(cert => `- ${cert}`).join('\n') || '- Add your certifications'}

---

### Projects
- **Project Name** | Tech Stack
  - A brief description of your project and your role.
  - Highlighted an key achievement or feature.

---

### Experience
- **Company Name** | *Role* | *Dates (e.g. Jun 2023 - Aug 2023)*
  - Achieved X by doing Y, resulting in Z.
  - Collaborated with team to develop and launch new feature.
`;
        setResumeMarkdown(initialMarkdown.trim());
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
      try {
        const input: GenerateResumeInput = {
          profile: profileForResume,
        };
        const result = await generateResume(input);
        setResumeMarkdown(result.resumeMarkdown);
        toast({
          title: 'Resume Generated!',
          description: 'Your new AI-generated resume is ready.',
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
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(resumeMarkdown).then(() => {
      setHasCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([resumeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Editor */}
        <div className="lg:col-span-1 grid auto-rows-max gap-4">
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FilePen className="h-5 w-5"/>
                        Resume Editor
                    </CardTitle>
                     <Button onClick={handleGenerateResume} disabled={isPending || !user} size="sm" variant="outline">
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                        ) : (
                        <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            AI Generate
                        </>
                        )}
                    </Button>
                </div>
                <CardDescription>
                    Edit your resume using Markdown. Your changes will be reflected in the live preview.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    value={resumeMarkdown}
                    onChange={(e) => setResumeMarkdown(e.target.value)}
                    className="h-[calc(100vh-22rem)] min-h-[400px] font-mono text-sm"
                    placeholder="Your resume in Markdown..."
                />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-2 grid auto-rows-max gap-4">
             <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            Live Preview
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                                {hasCopied ? <Check className="mr-2"/> : <Copy className="mr-2"/>}
                                Copy
                            </Button>
                             <Button variant="outline" size="sm" onClick={handleDownload}>
                                <Download className="mr-2"/>
                                Download .md
                            </Button>
                        </div>
                    </div>
                    <CardDescription>
                        This is how your resume will look. Use Markdown for formatting.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100vh-14rem)] min-h-[600px] overflow-y-auto rounded-lg border bg-background p-6">
                    <MarkdownPreview content={resumeMarkdown} />
                </CardContent>
             </Card>
        </div>
    </div>
  );
}
