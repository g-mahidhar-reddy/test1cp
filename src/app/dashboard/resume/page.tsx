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
import { Upload, FileText, Download } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase/provider';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

export default function ResumePage() {
  const { user } = useAuth();
  const { firebaseApp } = useFirebase();
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
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

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
        title: "Success!",
        description: "Your resume has been uploaded.",
      });

      await fetchExistingResume(); // Refresh the existing resume view
      setSelectedFile(null); // Clear the file input

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your resume. Please try again.",
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
              Replace your current resume by uploading a new PDF file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resume-upload">Resume (PDF)</Label>
              <div className="flex w-full items-center space-x-2">
                <Input id="resume-upload" type="file" accept=".pdf" onChange={handleFileChange} />
                <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                  {isUploading ? (
                    'Uploading...'
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
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
          <Button>Generate Resume</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
