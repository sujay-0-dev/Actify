// File: components/header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Award,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import LevelBadge from "@/components/gamification/level-badge";

// Temporarily mock the auth context until it's properly implemented
const mockUser = {
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  level: 3,
  karma: "250",
};

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  type: "achievement" | "challenge" | "karma";
}

interface NavItem {
  name: string;
  href: string;
}

export default function Header(): React.ReactElement {
  // Use mock user data for now - DO NOT USE useAuth() here
  const user = mockUser; // For testing purposes
  const logout = () => console.log("Logout called");

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
    }

    // Mock notifications
    setNotifications([
      {
        id: 1,
        title: "New badge earned!",
        message: "You've earned the 'Community Starter' badge",
        read: false,
        type: "achievement",
      },
      {
        id: 2,
        title: "Challenge completed!",
        message: "You've completed the 'Plant a Tree' challenge",
        read: false,
        type: "challenge",
      },
      {
        id: 3,
        title: "Karma points awarded",
        message: "+15 Karma for reporting a public issue",
        read: true,
        type: "karma",
      },
    ]);
    setHasUnread(true);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Public Issue Reporting", href: "/public-issues" },
    { name: "Skill Sharing", href: "/skill-sharing" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Community", href: "/community" },
    { name: "Welfare Schemes", href: "/welfare-schemes" },
    { name: "Eco Challenges", href: "/eco-challenges" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-white shadow-sm dark:bg-gray-900"
          : "bg-white dark:bg-gray-900"
      )}
    >
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="ActiSathi Logo"
                fill
                className="rounded-md"
              />
            </div>
            <span
              className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text"
            >
              ActiSathi
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="text-gray-700 dark:text-gray-300"
          >
            <Search className="w-5 h-5" />
          </Button>
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="relative text-gray-700 dark:text-gray-300"
                  >
                    <Bell className="w-5 h-5" />
                    {hasUnread && (
                      <span className="absolute flex w-2 h-2 top-1 right-1">
                        <span className="absolute inline-flex w-full h-full bg-indigo-400 rounded-full opacity-75 animate-ping" />
                        <span className="relative inline-flex w-2 h-2 bg-indigo-500 rounded-full" />
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="font-medium">Notifications</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all as read
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                          !notification.read &&
                            "bg-indigo-50 dark:bg-indigo-900/20"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              notification.type === "achievement"
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                : notification.type === "challenge"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                            )}
                          >
                            {notification.type === "achievement" ? (
                              <Award className="w-4 h-4" />
                            ) : notification.type === "challenge" ? (
                              <Award className="w-4 h-4" />
                            ) : (
                              <Award className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                              Just now
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        <LevelBadge level={user.level || 1} size="sm" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {user.karma + " Karma"}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/rewards" className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      <span>Rewards & Badges</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="hidden bg-indigo-600 md:inline-flex hover:bg-indigo-700">
                  Sign up
                </Button>
              </Link>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 md:hidden dark:text-gray-300"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  {user && (
                    <div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          <LevelBadge level={user.level || 1} size="sm" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-indigo-600 dark:text-indigo-400">
                          {user.karma + " Karma"}
                        </div>
                      </div>
                    </div>
                  )}
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                {user ? (
                  <div className="pt-4 mt-4 border-t">
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/profile"
                        className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center mt-2 text-sm font-medium text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-4 mt-4 border-t">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}