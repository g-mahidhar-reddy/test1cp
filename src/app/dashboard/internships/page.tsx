
'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InternshipCard } from "@/components/internship-card";
import { mockInternships } from "@/lib/data";
import { useAuth } from '@/contexts/auth-context';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Application } from '@/lib/types';


export default function InternshipsPage() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const applicationsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    const q = query(collection(firestore, `users/${user.id}/applications`));
    // @ts-ignore
    q.__memo = true;
    return q;
  }, [user, firestore]);

  const { data: applications } = useCollection<Application>(applicationsQuery);

  const appliedInternshipIds = useMemo(() => {
    return new Set(applications?.map(app => app.internshipId));
  }, [applications]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredInternships = useMemo(() => {
    return mockInternships.filter(internship => 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for internships, companies, skills..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Location
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Duration</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Stipend
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInternships.map((internship) => (
          <InternshipCard 
            key={internship.id} 
            internship={internship}
            hasApplied={appliedInternshipIds.has(internship.id)}
          />
        ))}
      </div>
    </div>
  );
}

