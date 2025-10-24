
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Internship, ApplicationStatus } from '@/lib/types';
import { MapPin, Clock, IndianRupee, Star, Briefcase, Building, Info, Book, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export function ApplyInternshipDialog({ internship }: { internship: Internship }) {
  const [open, setOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleApply = async () => {
    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to apply.",
        });
        return;
    }

    setIsApplying(true);
    
    const applicationData = {
        studentId: user.id,
        internshipId: internship.id,
        status: 'pending' as ApplicationStatus,
        appliedDate: serverTimestamp(),
        internshipDetails: { // Denormalizing data for easier access
            title: internship.title,
            companyName: internship.companyName,
            companyLogoUrl: internship.companyLogoUrl,
        },
         studentDetails: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    };
    
    const applicationsColRef = collection(firestore, `users/${user.id}/applications`);

    try {
        await addDoc(applicationsColRef, applicationData);
        
        toast({
            title: "Application Submitted!",
            description: `Your application for ${internship.title} has been sent.`,
        });
        setOpen(false); // Close the dialog on success
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: applicationsColRef.path,
            operation: 'create',
            requestResourceData: applicationData,
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
        setIsApplying(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex w-full items-center gap-2">
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </DialogTrigger>
        {/* We use a separate trigger for the main button to simplify the UI state */}
        <DialogTrigger asChild>
           <Button className="w-full">Apply Now</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{internship.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-1">
            <Building className="h-4 w-4" />
            {internship.companyName}
             {internship.verified && (
                <Badge variant="default" className="flex items-center gap-1 border-green-300 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300">
                    <Star className="h-3 w-3" /> Verified
                </Badge>
             )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
             <div className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <div><span className="font-semibold text-foreground">Location:</span> {internship.location}</div>
            </div>
            <div className="flex items-start gap-2">
                <Clock className="mt-1 h-4 w-4 flex-shrink-0" />
                 <div><span className="font-semibold text-foreground">Duration:</span> {internship.duration}</div>
            </div>
            <div className="flex items-start gap-2">
                <IndianRupee className="mt-1 h-4 w-4 flex-shrink-0" />
                 <div><span className="font-semibold text-foreground">Stipend:</span> {internship.stipend}</div>
            </div>
             <div className="flex items-start gap-2">
                <Briefcase className="mt-1 h-4 w-4 flex-shrink-0" />
                 <div><span className="font-semibold text-foreground">Credits:</span> {internship.credits}</div>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground flex items-center gap-2"><Info className="h-4 w-4" /> Description</h4>
            <p className="text-sm text-muted-foreground">{internship.description}</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground flex items-center gap-2"><Book className="h-4 w-4" /> Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {internship.requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Close
                </Button>
            </DialogClose>
            <Button onClick={handleApply} disabled={isApplying}>
                {isApplying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : 'Confirm Application'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
