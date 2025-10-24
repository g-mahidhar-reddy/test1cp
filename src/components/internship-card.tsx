import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Internship } from "@/lib/types";
import { MapPin, Clock, IndianRupee, Star } from "lucide-react";
import { ApplyInternshipDialog } from "./apply-internship-dialog";

export function InternshipCard({ internship }: { internship: Internship }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 bg-muted/20 p-4">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={internship.companyLogoUrl} alt={internship.companyName} />
          <AvatarFallback>{internship.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <CardTitle>{internship.title}</CardTitle>
          <CardDescription>{internship.companyName}</CardDescription>
        </div>
        {internship.verified && (
          <div className="ml-auto flex items-center gap-1 text-sm text-green-600">
             <Star className="h-4 w-4 fill-green-600"/>
             <span className="font-semibold">Verified</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4">
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{internship.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            <span>{internship.stipend}</span>
          </div>
           <div className="flex items-center gap-2">
            <Badge variant="outline">Credits: {internship.credits}</Badge>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {internship.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <ApplyInternshipDialog internship={internship} />
      </CardFooter>
    </Card>
  );
}
