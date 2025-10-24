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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase, useFirestore } from '@/firebase/provider';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { parseResume } from '@/ai/flows/parse-resume-flow';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function ResumePage() {
  const { user, setUser } = useAuth();
  const { firebaseApp } = useFirebase();
  const firestore = useFirestore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingResume, setExistingResume] = useState<{ name: string; url: string } | null>(null);
  const { toast } = useToast();
  const storage = getStorage(firebaseApp);

  const fetchExistingResume = useCallback(async () => {
    if (!user) return;
    const resumeFolderRef = ref(storage, `resumes/${user.id}`);
    try {
      const res = await listAll(resumeFolderRef);
      if (res.items.length > 0) {
        const firstItem = res.items[0];
        const url = await getDownloadURL(firstItem);
        setExistingResume({ name: firstItem.name, url });
      } else {
        setExistingResume(null);
      }
    } catch (error) {
      console.error('Error fetching existing resume:', error);
      setExistingResume(null);
    }
  }, [user, storage]);

  useEffect(() => {
    if (user) {
      fetchExistingResume();
    }
  }, [user, fetchExistingResume]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type === 'application/pdf') {
        setSelectedFile(e.target.files[0]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF file.',
        });
        setSelectedFile(null);
      }
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !firestore) return;

    setIsUploading(true);
    const resumeFolderRef = ref(storage, `resumes/${user.id}`);
    
    try {
      // Delete existing resumes if any
      const existingFiles = await listAll(resumeFolderRef);
      for (const itemRef of existingFiles.items) {
        await deleteObject(itemRef);
      }

      // Upload the new file
      const resumeRef = ref(storage, `resumes/${user.id}/${selectedFile.name}`);
      await uploadBytes(resumeRef, selectedFile);
      
      toast({
        title: "Resume Uploaded!",
        description: "Now analyzing your resume to extract skills...",
      });

      await fetchExistingResume(); // Refresh the existing resume view
      
      // Parse resume and update skills
      const dataUri = await fileToDataUri(selectedFile);
      const parsedData = await parseResume({ resumeDataUri: dataUri });

      if (parsedData && parsedData.skills.length > 0) {
        const userDocRef = doc(firestore, 'users', user.id);
        const newSkills = parsedData.skills.map(skill => ({ name: skill }));
        
        // Merge with existing skills, avoiding duplicates
        const existingSkills = user.skills || [];
        const combinedSkills = [...existingSkills];
        newSkills.forEach(newSkill => {
            if (!existingSkills.some(existingSkill => existingSkill.name.toLowerCase() === newSkill.name.toLowerCase())) {
                combinedSkills.push(newSkill);
            }
        });
        
        const dataToSave = { skills: combinedSkills };
        setDoc(userDocRef, dataToSave, { merge: true })
          .then(() => {
              setUser(prev => prev ? { ...prev, skills: combinedSkills } : null);
              toast({
                title: "Skills Updated!",
                description: `We've added ${parsedData.skills.length} skills from your resume to your profile.`,
              });
          })
          .catch((error) => {
              const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: dataToSave,
              });
              errorEmitter.emit('permission-error', permissionError);
          });

      } else {
         toast({
          title: "Analysis Complete",
          description: "We couldn't extract any new skills from your resume.",
        });
      }

      setSelectedFile(null); // Clear the file input

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your resume file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Resume</CardTitle>
            <CardDescription>Manage your currently uploaded resume.</CardDescription>
          </CardHeader>
          <CardContent>
            {existingResume ? (
              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <p className="font-medium truncate">{existingResume.name}</p>
                </div>
                <Button variant="outline" size="icon" asChild>
                  <a href={existingResume.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Resume</span>
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 p-8">
                <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Your resume is securely stored and only shared with companies you apply to.
            </p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upload New Resume</CardTitle>
            <CardDescription>
              Replace your current resume by uploading a new PDF file. This will also update your skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resume-upload">Resume (PDF only)</Label>
              <div className="flex w-full items-center space-x-2">
                <Input id="resume-upload" type="file" accept=".pdf" onChange={handleFileChange} />
                <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                  {isUploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">Max file size: 5MB.</p>
          </CardFooter>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Create Resume from Profile</CardTitle>
          <CardDescription>
            Generate a new resume using the information from your profile. Keep
            your profile updated for the best results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click the button below to generate a standardized resume based on
            your skills, experiences, and academic achievements listed in your
            profile.
          </p>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>Generate Resume (Coming Soon)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
