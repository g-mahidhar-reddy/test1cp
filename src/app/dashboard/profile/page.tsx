import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// This would come from useAuth() and be editable
const user = {
  name: "Aarav Sharma",
  email: "student@example.com",
  role: "student",
  college: "IIT Bombay",
  company: "",
  phone: "123-456-7890",
  branch: "Computer Science",
  semester: 6,
  gpa: 8.5,
  skills: ["React", "Node.js", "TypeScript"],
  certifications: ["AWS Certified Cloud Practitioner"],
  linkedinUrl: "https://linkedin.com/in/aaravsharma",
  portfolioUrl: "https://github.com/aaravsharma",
};


export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Manage your account settings and personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} />
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
              <div className="grid gap-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea id="skills" placeholder="React, Node.js, Python..." defaultValue={user.skills?.join(', ')} />
                <p className="text-sm text-muted-foreground">Enter skills separated by commas.</p>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea id="certifications" placeholder="AWS Certified Developer, etc." defaultValue={user.certifications?.join(', ')} />
                 <p className="text-sm text-muted-foreground">Enter certifications separated by commas.</p>
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

          <div className="flex justify-end">
             <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
