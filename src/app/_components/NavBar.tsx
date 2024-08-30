"use client";

import { SignOutButton, useClerk } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../../public/_images/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NavBar() {
  const { openUserProfile } = useClerk();

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:px-8">
      <div className="flex items-center gap-2">
        <Image
          className="relative rounded-full h-10 w-10 mx-auto object-cover z-20 border-4"
          src={Logo}
          alt="logo"
        ></Image>
        <span className="text-lg font-semibold">Easy Rag</span>
      </div>
      <nav className="hidden lg:flex lg:items-center lg:gap-4">
        <Link className="text-sm font-medium hover:underline" href="/home">
          Home
        </Link>
        <Link className="text-sm font-medium hover:underline" href="/about">
          About
        </Link>
        <Link className="text-sm font-medium hover:underline" href="/contact">
          Contact Us
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                openUserProfile();
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton>Sign Out</SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden" size="icon" variant="outline">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4">
              <Link
                className="text-sm font-medium hover:underline"
                href="/home"
              >
                Home
              </Link>
              <Link
                className="text-sm font-medium hover:underline"
                href="/about"
              >
                About
              </Link>
              <Link
                className="text-sm font-medium hover:underline"
                href="/contact"
              >
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
