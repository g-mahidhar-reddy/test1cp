import Link from 'next/link';
import { BookOpenCheck } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <BookOpenCheck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">PrashikshanConnect</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
