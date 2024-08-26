import Link from "next/link"
import { Menu, User } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "../_images/logo.png";

export default function NavBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:px-8">
      <div className="flex items-center gap-2">
        <Image
          className=" h-6 w-6 text-primary"
          src={Logo}
          alt="logo"
        >

        </Image>
        <span className="text-lg font-semibold">Easy Rag</span>
      </div>
      <nav className="hidden lg:flex lg:items-center lg:gap-4">
        <Link
          className="text-sm font-medium hover:underline"
          href="/"
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
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
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
                href="/"
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
  )
}