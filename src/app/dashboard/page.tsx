
'use client';

import {
  Activity,
  ArrowUpRight,
  Briefcase,
  FileText,
  Users,
} from "lucide-react";
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
import { StatCard } from "@/components/stat-card";
import { OverviewChart } from "@/components/overview-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useCollection } from "@/firebase";
import { useMemo } from "react";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import type { Application, Internship, MoU, StatCardData } from "@/lib/types";

function StudentDashboard() {
    const { user } = useAuth();
    const firestore = useFirestore();

    const applicationsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        const q = query(
            collection(firestore, `users/${user.id}/applications`),
            orderBy('appliedDate', 'desc')
        );
        // @ts-ignore
        q.__memo = true;
        return q;
    }, [user, firestore]);

    const { data: applications, isLoading: isLoadingApplications } = useCollection<Application>(applicationsQuery);

    const studentStats = useMemo(() => {
        if (!applications) {
            return [
                { title: "Internships Applied", value: "0", icon: Briefcase },
                { title: "Active Applications", value: "0", icon: Activity },
                { title: "Credits Earned", value: "0", icon: ArrowUpRight, change: "Coming soon" },
                { title: "Companies Connected", value: "0", icon: Users, change: "Coming soon" },
            ];
        }

        const activeStatuses: Application['status'][] = ['pending', 'reviewed', 'shortlisted', 'accepted'];
        const activeApplications = applications.filter(app => activeStatuses.includes(app.status)).length;
        const creditsEarned = applications
            .filter(app => app.status === 'completed')
            .reduce((sum, app) => sum + (app.internshipDetails?.credits || 0), 0);

        const connectedCompanies = new Set(applications.map(app => app.internshipDetails?.companyName)).size;

        return [
            { title: "Internships Applied", value: applications.length.toString(), icon: Briefcase },
            { title: "Active Applications", value: activeApplications.toString(), icon: Activity },
            { title: "Credits Earned", value: creditsEarned.toString(), icon: ArrowUpRight },
            { title: "Companies Connected", value: connectedCompanies.toString(), icon: Users },
        ];
    }, [applications]);

    const recentApplications = applications?.slice(0, 5) || [];

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {(isLoadingApplications ? Array(4).fill({}) : studentStats).map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Internship Progress</CardTitle>
                        <CardDescription>
                            Your application and completion overview for this year.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                        <CardDescription>
                            Displaying your last {recentApplications.length} applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingApplications ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : recentApplications.length > 0 ? (
                                    recentApplications.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                                        <AvatarImage src={app.internshipDetails?.companyLogoUrl} alt="Avatar" />
                                                        <AvatarFallback>
                                                            {app.internshipDetails?.companyName?.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium">{app.internshipDetails?.companyName}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center">
                                            No recent applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}


function FacultyDashboard() {
    const firestore = useFirestore();

    const mousQuery = useMemo(() => {
        if (!firestore) return null;
        const q = query(collection(firestore, `mous`));
        // @ts-ignore
        q.__memo = true;
        return q;
    }, [firestore]);
    
    const { data: mous, isLoading: isLoadingMous } = useCollection<MoU>(mousQuery);

    const facultyStats: StatCardData[] = [
        { title: "Active MoUs", value: mous?.filter(mou => mou.status === 'active').length.toString() || '0', icon: FileText },
        { title: "Students on Internships", value: "150", icon: Users },
        { title: "Companies Partnered", value: new Set(mous?.map(m => m.company)).size.toString() || '0', icon: Briefcase },
        { title: "Total Credits Approved", value: "1,200", icon: ArrowUpRight },
    ];
    
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                 {(isLoadingMous ? Array(4).fill({}) : facultyStats).map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            {/* Add Faculty specific charts/tables here */}
             <p className="text-center text-muted-foreground">Faculty dashboard components are under construction.</p>
        </>
    );
}

function IndustryDashboard() {
    const { user } = useAuth();
    const firestore = useFirestore();

    const internshipsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        const q = query(collection(firestore, `internships`), where('postedBy', '==', user.id));
         // @ts-ignore
        q.__memo = true;
        return q;
    }, [user, firestore]);

     const applicationsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        // This is a simplified query for demo purposes.
        const q = query(collection(firestore, `applications`));
         // @ts-ignore
        q.__memo = true;
        return q;
    }, [user, firestore]);

    const { data: internships, isLoading: isLoadingInternships } = useCollection<Internship>(internshipsQuery);
    const { data: applications, isLoading: isLoadingApplications } = useCollection<Application>(applicationsQuery);
    
    const industryStats: StatCardData[] = [
        { title: "Active Internships", value: internships?.length.toString() || '0', icon: Briefcase },
        { title: "Total Applicants", value: applications?.length.toString() || '0', icon: Users },
        { title: "Shortlisted Candidates", value: applications?.filter(a => a.status === 'shortlisted').length.toString() || '0', icon: Activity },
        { title: "Successful Hires", value: applications?.filter(a => a.status === 'accepted').length.toString() || '0', icon: ArrowUpRight },
    ];

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                 {(isLoadingInternships || isLoadingApplications ? Array(4).fill({}) : industryStats).map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
             {/* Add Industry specific charts/tables here */}
             <p className="text-center text-muted-foreground">Industry dashboard components are under construction.</p>
        </>
    );
}


export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'industry':
        return <IndustryDashboard />;
      default:
        return (
             <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }
  };

  return renderDashboardByRole();
}
