'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import type { Application } from "@/lib/types";
import { useMemo } from "react";
import { format } from "date-fns";

function StudentApplicationsView() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const applicationsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.id}/applications`),
      orderBy('appliedDate', 'desc')
    );
  }, [user, firestore]);

  const { data: applications, isLoading } = useCollection<Application>(applicationsQuery);

  const formatDate = (timestamp: any) => {
    if (timestamp && timestamp.toDate) {
      return format(timestamp.toDate(), 'PPP');
    }
    return 'N/A';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Applications</CardTitle>
        <CardDescription>Track the status of all your internship applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Internship</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading your applications...
                </TableCell>
              </TableRow>
            ) : applications && applications.length > 0 ? (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.internshipDetails?.title}</TableCell>
                  <TableCell>{app.internshipDetails?.companyName}</TableCell>
                  <TableCell>{formatDate(app.appliedDate)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>{app.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  You haven't applied to any internships yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function IndustryApplicantsView() {
    const { user } = useAuth();
    const firestore = useFirestore();
    // This query would need to be more complex in a real app,
    // likely querying an 'applications' root collection where internship postedBy matches user id.
    // For this example, we'll imagine a simplified query fetching all applications to the industry user's internships.
    const applicationsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        // This is a simplified query. A real implementation would be more complex.
        return query(collection(firestore, `applications`));
    }, [user, firestore]);
    
    const { data: applications, isLoading } = useCollection<Application>(applicationsQuery);

    const formatDate = (timestamp: any) => {
        if (timestamp && timestamp.toDate) {
            return format(timestamp.toDate(), 'PPP');
        }
        return 'N/A';
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicants</CardTitle>
        <CardDescription>Manage applications for your posted internships.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Internship</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Applied On</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading applicants...
                </TableCell>
              </TableRow>
            ) : applications && applications.length > 0 ? (
            applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="hidden sm:table-cell">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={app.studentDetails?.avatarUrl} alt="Avatar" />
                    <AvatarFallback>{app.studentDetails?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{app.studentDetails?.name}</TableCell>
                <TableCell>{app.internshipDetails?.title}</TableCell>
                <TableCell>
                  <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>{app.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(app.appliedDate)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Shortlist</DropdownMenuItem>
                      <DropdownMenuItem>Reject</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No applicants yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function ApplicationsPage() {
  const { user } = useAuth();
  
  if (user?.role === "industry") {
    return <IndustryApplicantsView />;
  }
  return <StudentApplicationsView />;
}
