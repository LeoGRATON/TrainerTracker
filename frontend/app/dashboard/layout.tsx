"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Calendar, Dumbbell, Home, LogOut, Target } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    } else {
      router.push("/auth/login");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sub">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
    { name: "Zones", href: "/dashboard/zones", icon: Target },
    { name: "Séances", href: "/dashboard/workouts", icon: Dumbbell },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="bg-neutral-900 text-white px-24">
        <div className="flex flex-row h-full">
          {/* Logo */}
          <div className="py-6 border-b border-neutral-800 flex items-center">
            <img src="/logo/TrainerTracker.png" alt="TriZone" />
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 rounded-lg hover:bg-neutral-800 transition-smooth"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="py-4 border-t border-neutral-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800 p-2"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Avatar Circle */}
                    <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-neutral-900 font-semibold flex-shrink-0">
                      {(user.user_metadata?.full_name || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white"
                align="end"
                side="right"
              >
                <DropdownMenuLabel className="text-neutral-900">
                  Mon compte
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-neutral-700 hover:bg-neutral-100">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.user_metadata?.full_name || "Utilisateur"}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 hover:bg-red-50 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="px-24">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
