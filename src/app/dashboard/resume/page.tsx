
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Check, FilePen, Wand2, Download, File, Image as ImageIcon, FileText } from 'lucide-react';
import React, { useState, useTransition, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { generateResume } from '@/ai/flows/generate-resume-flow';
import type { GenerateResumeInput } from '@/lib/resume-types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';


// A simple Markdown renderer component
const MarkdownPreview = ({ content, forwardedRef }: { content: string, forwardedRef: React.Ref<HTMLDivElement> }) => {
  const renderMarkdown = (text: string) => {
    // This is a very basic renderer, a library like 'marked' or 'react-markdown' would be better for a real app.
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

  return <div className="prose prose-sm dark:prose-invert max-w-none" ref={forwardedRef} dangerouslySetInnerHTML={renderMarkdown(content)} />;
};


export default function ResumePage() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [resumeMarkdown, setResumeMarkdown] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const profileForResume = useMemo(() => {
    if (!user) return null;
    return {
      name: user.name,
      email: user.email,
      phone: user.phone || 'Not Provided',
      linkedinUrl: user.linkedinUrl || 'Not Provided',
      portfolioUrl: user.portfolioUrl || 'Not Provided',
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
          profile: profileForResume as any, // Cast because some fields might be undefined
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

  const handleDownloadMarkdown = () => {
    const blob = new Blob([resumeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    toast({ title: "Generating PDF...", description: "Please wait while we create your PDF." });
    
    try {
        const canvas = await html2canvas(previewRef.current, { 
            scale: 2, // Higher scale for better resolution
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('resume.pdf');
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({ variant: 'destructive', title: "PDF Generation Failed", description: "Something went wrong. Please try again."});
    } finally {
        setIsDownloading(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    toast({ title: "Generating PNG...", description: "Please wait while we create your image." });

    try {
        const canvas = await html2canvas(previewRef.current, { 
            scale: 2, // Higher scale for better quality
            backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.download = 'resume.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Failed to generate PNG:", error);
        toast({ variant: 'destructive', title: "PNG Generation Failed", description: "Something went wrong. Please try again."});
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Editor */}
        <Card className="lg:col-span-1">
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
                    className="h-[calc(100vh-22rem)] min-h-[600px] font-mono text-sm"
                    placeholder="Your resume in Markdown..."
                />
            </CardContent>
        </Card>

        {/* Right Column: Preview */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Live Preview
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopyToClipboard} disabled={isDownloading}>
                            {hasCopied ? <Check /> : <Copy />}
                            <span className="ml-2">Copy Markdown</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" size="sm" disabled={isDownloading}>
                                    {isDownloading ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
                                    Download
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleDownloadPdf}>
                                    <File className="mr-2 h-4 w-4" />
                                    Download as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadPng}>
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Download as PNG
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadMarkdown}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Download as Markdown
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <CardDescription>
                    This is how your resume will look. Use Markdown for formatting.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100vh-16rem)] min-h-[600px] overflow-y-auto rounded-lg border bg-background">
                <div className="p-8 bg-white text-black">
                     <MarkdownPreview content={resumeMarkdown} forwardedRef={previewRef} />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
