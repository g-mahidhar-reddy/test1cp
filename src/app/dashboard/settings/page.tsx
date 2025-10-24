
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Bell, Shield, HelpCircle, Linkedin, Mail, Upload, FileText, Download, Trash2, PlusCircle, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React, { useState } from 'react';

const userCertificates = [
    { id: 'cert1', name: 'AI Internship Certificate.pdf', url: '#', uploadedAt: '2024-07-20' },
    { id: 'cert2', name: 'Advanced React Course.png', url: '#', uploadedAt: '2024-06-15' }
];

const predefinedSkills = {
  "Programming & Tech": ["Python", "Java", "JavaScript", "HTML", "CSS", "React", "Node.js", "Firebase", "SQL", "C++", "Machine Learning", "Data Science", "Cloud Computing", "Cybersecurity", "API Development"],
  "Design & Creativity": ["UI/UX Design", "Graphic Design", "Figma", "Adobe Photoshop", "Video Editing", "3D Modeling"],
  "Business & Management": ["Communication", "Team Leadership", "Marketing", "Project Management", "Entrepreneurship", "Sales Strategy"],
  "Personal & Soft Skills": ["Problem Solving", "Critical Thinking", "Collaboration", "Creativity", "Adaptability"],
};


function AccountTab() {
  const { user } = useAuth();
  const [userSkills, setUserSkills] = useState<string[]>(user?.skills || []);
  
  if (!user) {
    return null;
  }

  const handleAddSkill = (skill: string) => {
    if (skill && !userSkills.includes(skill)) {
      setUserSkills([...userSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };


  return (
    <div className="space-y-8">
        {/* Profile Details Card */}
        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information and profile picture.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form className="grid gap-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2">
                             <Label htmlFor="profile-picture">Profile Picture</Label>
                             <Input id="profile-picture" type="file" className="max-w-sm" />
                             <p className="text-sm text-muted-foreground">PNG, JPG, or GIF up to 5MB.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" defaultValue={user.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue={user.role} disabled />
                        </div>
                    </div>

                    {user.role === 'student' && (
                        <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="grid gap-2">
                            <Label htmlFor="college">College/University</Label>
                            <Input id="college" defaultValue={user.college} />
                            </div>
                            <div className="grid gap-2">
                            <Label htmlFor="branch">Branch</Label>
                            <Input id="branch" defaultValue={user.branch} />
                            </div>
                            <div className="grid gap-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Input id="semester" type="number" defaultValue={user.semester} />
                            </div>
                            <div className="grid gap-2">
                            <Label htmlFor="gpa">GPA</Label>
                            <Input id="gpa" type="number" step="0.1" defaultValue={user.gpa} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input id="linkedin" defaultValue={user.linkedinUrl} />
                            </div>
                            <div className="grid gap-2">
                            <Label htmlFor="portfolio">Portfolio URL</Label>
                            <Input id="portfolio" defaultValue={user.portfolioUrl} />
                            </div>
                        </div>
                        </>
                    )}

                    {user.role === 'industry' && (
                        <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" defaultValue={user.company} />
                        </div>
                    )}
                </form>
            </CardContent>
             <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Last updated on July 20, 2024</p>
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>

        {/* Certificates Card */}
        <Card>
            <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Upload and manage your professional certificates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid w-full max-w-full items-center gap-1.5">
                  <Label htmlFor="certificate-upload">Upload Certificate (PDF, PNG, JPG)</Label>
                  <div className="flex w-full items-center space-x-2">
                    <Input id="certificate-upload" type="file" accept=".pdf,.png,.jpg,.jpeg" />
                    <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload</Button>
                  </div>
                </div>
                <div className="space-y-4">
                    <h4 className="font-medium text-sm">Uploaded Certificates</h4>
                    {userCertificates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userCertificates.map(cert => (
                                <div key={cert.id} className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-6 w-6 text-muted-foreground" />
                                        <p className="font-medium truncate text-sm">{cert.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">Download</span>
                                            </a>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 p-8">
                            <p className="text-sm text-muted-foreground">No certificates uploaded yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Skills Card */}
        <Card>
            <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>Manage your skills to get better internship recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div>
                    <h4 className="font-medium text-sm mb-2">Your Skills</h4>
                     <div className="flex flex-wrap gap-2">
                        {userSkills.length > 0 ? userSkills.map(skill => (
                             <Badge key={skill} variant="secondary" className="flex items-center gap-1.5 pr-1 text-base">
                                {skill}
                                <button onClick={() => handleRemoveSkill(skill)} className="rounded-full hover:bg-background/50 p-0.5">
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove {skill}</span>
                                </button>
                            </Badge>
                        )) : <p className="text-sm text-muted-foreground">Add skills from the suggestions below or add your own.</p>}
                     </div>
                </div>
                 <div className="space-y-4">
                    <h4 className="font-medium text-sm">Suggested Skills</h4>
                     {Object.entries(predefinedSkills).map(([category, skills]) => (
                        <div key={category}>
                            <h5 className="font-semibold text-xs text-muted-foreground mb-2">{category}</h5>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => !userSkills.includes(skill) && (
                                    <Button key={skill} variant="outline" size="sm" onClick={() => handleAddSkill(skill)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        {skill}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input placeholder="Add a custom skill..."/>
                      <Button variant="outline" size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Custom Skill
                      </Button>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4 flex justify-end">
                <Button>Save Skills</Button>
            </CardFooter>
        </Card>
    </div>
  )
}

function PreferencesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize the look, feel, and usability of the application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
          </div>
          <ThemeToggle />
        </div>
         <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="font-medium">Language</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred language.</p>
          </div>
          <Select defaultValue="en">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="mr">Marathi</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="font-medium">Show Analytics Cards</h3>
            <p className="text-sm text-muted-foreground">Toggle visibility of analytics on your dashboard.</p>
          </div>
          <Switch id="analytics-toggle" defaultChecked />
        </div>
      </CardContent>
       <CardFooter className="border-t px-6 py-4">
            <Button>Save Preferences</Button>
        </CardFooter>
    </Card>
  )
}

function NotificationsTab() {
    const notifications = [
        { id: "internshipUpdates", label: "Internship Updates", description: "New internships matching your profile." },
        { id: "applicationFeedback", label: "Application Feedback", description: "Status changes and feedback on your applications." },
        { id: "creditAlerts", label: "Credit / Report Notifications", description: "Updates on your internship credits and reports." },
        { id: "mentorMessages", label: "Mentor Messages", description: "New messages from your mentors." },
        { id: "announcements", label: "General Announcements", description: "Platform updates and news." },
    ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage how you receive notifications from the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map(notification => (
           <div key={notification.id} className="flex items-start justify-between rounded-lg border p-4">
             <div>
                <Label htmlFor={notification.id} className="font-medium">{notification.label}</Label>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
             </div>
             <Switch id={notification.id} defaultChecked={notification.id !== 'creditAlerts'} />
           </div>
        ))}
      </CardContent>
       <CardFooter className="border-t px-6 py-4">
            <Button>Save Notifications</Button>
        </CardFooter>
    </Card>
  )
}

function SecurityTab() {
    const { user } = useAuth();
    if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
            <Label htmlFor="email-security">Email</Label>
            <Input id="email-security" value={user.email} disabled />
            <p className="text-sm text-muted-foreground mt-2">Your email is used for login and cannot be changed here.</p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">It's a good idea to use a strong password that you're not using elsewhere.</p>
            </div>
            <Button variant="outline">Change Password</Button>
        </div>
         <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <h3 className="font-medium">Two-Factor Verification</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <Switch id="2fa-toggle" />
        </div>
         <div className="rounded-lg border p-4">
            <h3 className="font-medium">Last Login</h3>
            <p className="text-sm text-muted-foreground">About 2 hours ago from 192.168.1.1</p>
        </div>
      </CardContent>
       <CardFooter className="border-t bg-destructive/10 px-6 py-4">
           <div className="flex w-full items-center justify-between">
                <div>
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-destructive/80">Permanently delete your account and all associated data. This action is irreversible.</p>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
           </div>
        </CardFooter>
    </Card>
  )
}

function HelpSupportTab() {
    const faqs = [
        { q: "How do I apply for an internship?", a: "Navigate to the 'Internships' tab, browse the available listings, and click 'Apply Now' on any internship you're interested in. Make sure your profile and resume are up to date!" },
        { q: "Can I get academic credits for my internship?", a: "Yes, many internships on our platform are eligible for academic credits. This is indicated on the internship details page. Your faculty coordinator will approve the credits upon successful completion." },
        { q: "How do I manage my MoUs? (For Faculty)", a: "As a faculty member, you can manage all Memoranda of Understanding from the 'Manage MoUs' tab on your dashboard. You can add new MoUs, view existing ones, and check their validity." },
    ];
    return (
        <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.q}</AccordionTrigger>
                            <AccordionContent>{faq.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Having an issue? Fill out the form below to submit a support ticket.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., 'Unable to upload resume'" />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Describe your issue in detail..." className="min-h-[120px]" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
                <div>
                     <Button variant="link" asChild><a href="#">Privacy Policy</a></Button>
                     <Button variant="link" asChild><a href="#">Terms of Use</a></Button>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon"><Linkedin className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Mail className="h-5 w-5" /></Button>
                    <Button>Submit Ticket</Button>
                </div>
            </CardFooter>
        </Card>
        </div>
    )
}


export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mb-4">
          <h1 className="font-semibold text-2xl md:text-3xl">Settings</h1>
          <p className="text-muted-foreground">Hi, {user?.name}! Manage your account, preferences, and notifications.</p>
      </div>
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="account"><User className="mr-2 h-4 w-4" />Account</TabsTrigger>
          <TabsTrigger value="preferences"><Settings className="mr-2 h-4 w-4" />Preferences</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4" />Security</TabsTrigger>
          <TabsTrigger value="help"><HelpCircle className="mr-2 h-4 w-4" />Help & Support</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-6">
          <AccountTab />
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
           <PreferencesTab />
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
            <NotificationsTab />
        </TabsContent>
        <TabsContent value="security" className="mt-6">
            <SecurityTab />
        </TabsContent>
        <TabsContent value="help" className="mt-6">
            <HelpSupportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
