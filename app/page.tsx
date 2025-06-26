"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-300  dark:bg-gray-950 text-gray-900 dark:text-white rounded-ee-2xl ">
      {/* Hero */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-20 py-12 gap-10">

        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Master Your Day with AI-Powered Task Generation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Just type a topic — let Gemini AI suggest smart, bite-sized tasks.
            Organize, complete, and track your progress effortlessly.
          </p>
          <Link href="/dashboard">
            <Button className="text-lg px-6 py-4">Get Started</Button>
          </Link>
        </div>

        {/* Image */}
        <div className="w-full max-w-xs md:max-w-lg">
          <Image
            src="/landing.jpg"
            alt="Gemini Tasks Illustration"
            width={450}
            height={100}
            priority 
            className="rounded-xl shadow-lg border"
          />
        </div>
      </main>



      {/* Features Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-20 px-6 items-center justify-center">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center justify-center ">
          <div>
            <Image src="/ai.jpg" alt="AI Icon" width={100} height={60} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Task Generation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate smart, actionable learning tasks using Google Gemini AI.
            </p>
          </div>
          <div>
            <Image src="/progress.png" alt="CRUD Icon" width={100} height={60} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Complete CRUD</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create, update, and delete your tasks with ease. Track your progress in real time.
            </p>
          </div>
          <div>
            <Image src="/secure.jpg" alt="Secure Auth Icon" width={100} height={60} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Protected with Clerk. Only you can see and manage your data.
            </p>
          </div>
        </div>
      </section>



    </div>
  );
}
