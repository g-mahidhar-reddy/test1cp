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

// This would come from useAuth() and be editable
const user = {
  name: "Aarav Sharma",
  email: "student@example.com",
  role: "student",
  college: "IIT Bombay",
  company: ""
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
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue={user.role} disabled />
            </div>
            {user.role !== 'industry' && (
                <div className="grid gap-2">
                    <Label htmlFor="college">College/University</Label>
                    <Input id="college" defaultValue={user.college} />
                </div>
            )}
             {user.role === 'industry' && (
                <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue={user.company} />
                </div>
            )}
          </div>
          <div className="flex justify-end">
             <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
