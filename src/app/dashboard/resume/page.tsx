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
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Download } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Resume</CardTitle>
            <CardDescription>
              Manage your currently uploaded resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <p className="font-medium">Aarav-Sharma-Resume.pdf</p>
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download Resume</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Last updated: 2024-05-20
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
                <Input id="resume-upload" type="file" accept=".pdf" />
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Max file size: 5MB.
            </p>
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
