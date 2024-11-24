"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LogOutIcon, ShieldIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldIcon className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOutIcon className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}