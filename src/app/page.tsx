import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <SignInButton mode="modal">Sign In</SignInButton>
  );
}
