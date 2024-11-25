import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShirtIcon, RefreshCwIcon, ShieldIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Theme Toggle in the top-right corner */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <h1 className="text-4xl font-bold text-center mb-4">
          Northern Eagles District
        </h1>
        <h2 className="text-3xl font-semibold text-center mb-8">
          Uniform Management
        </h2>

        <div className="w-64 h-64 relative mb-12">
          <Image
            src="public/northern-eagles-logo.png"
            alt="Northern Eagles Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-8">
          <Link href="/borrow" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShirtIcon className="h-6 w-6 text-primary" />
                  Borrow Uniforms
                </CardTitle>
                <CardDescription>
                  Request uniforms for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Browse available uniform types</li>
                  <li>Submit borrowing request</li>
                  <li>Track your request status</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/return" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCwIcon className="h-6 w-6 text-primary" />
                  Return Uniforms
                </CardTitle>
                <CardDescription>
                  Process uniform returns easily
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Quick return process</li>
                  <li>Report uniform condition</li>
                  <li>Get return confirmation</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Link href="/admin">
          <Button variant="outline" className="gap-2">
            <ShieldIcon className="h-4 w-4" />
            Admin Access
          </Button>
        </Link>
      </div>
    </main>
  );
}