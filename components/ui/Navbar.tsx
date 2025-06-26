"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full h-16 px-6 flex items-center justify-between border-b shadow-sm bg-slate-900 dark:bg-gray-950">
      <Link href="/" className="text-xl font-bold  text-white">
        GeminiTasks
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm hover:underline text-white">
          Home
        </Link>
        <Link href="/dashboard" className="text-sm hover:underline text-white">
          Dashboard
        </Link>

        {/* Show Sign In or User Menu depending on auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm bg-black text-white px-4 py-1.5 rounded-md hover:bg-gray-800">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
