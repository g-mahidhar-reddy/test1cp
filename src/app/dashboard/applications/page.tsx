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
import { mockApplications } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// This would come from useAuth() in a client component
const userRole = "student"; // 'student' or 'industry'

function StudentApplicationsView() {
  const myApplications = mockApplications.filter(app => app.studentId === 'student1');
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
            {myApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.internshipDetails?.title}</TableCell>
                <TableCell>{app.internshipDetails?.companyName}</TableCell>
                <TableCell>{app.appliedDate}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>{app.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function IndustryApplicantsView() {
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
            {mockApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="hidden sm:table-cell">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={app.studentDetails?.avatarUrl} alt="Avatar" />
                    <AvatarFallback>{app.studentDetails?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{app.studentDetails?.name}</TableCell>
                <TableCell>{app.internshipDetails?.title}</TableCell>
                <TableCell>
                  <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>{app.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{app.appliedDate}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function ApplicationsPage() {
  if (userRole === "industry") {
    return <IndustryApplicantsView />;
  }
  return <StudentApplicationsView />;
}
