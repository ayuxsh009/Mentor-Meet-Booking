"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Video, MessageSquare, Users, BookOpen, MessageCircle, FileText, Mic } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isHovering, setIsHovering] = useState<number | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      router.push("/app");
    }
  }, [isSignedIn, router]);



  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden relative">
      {/* Simplified background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 opacity-50" />

      <SignedOut>
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex justify-between items-center p-6 max-w-7xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            Mentor Meet Booking
          </motion.div>
          <div className="flex gap-4">
            <SignInButton >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </SignInButton>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative container mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Elevate
              </span>{" "}
              Your Learning Experience
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Select a module below to enhance your learning journey. Each tool is designed to support your educational goals.
            </p>
            <div className="flex justify-center gap-4">
              <SignInButton >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Explore Modules
                  </Button>
                </motion.div>
              </SignInButton>
            </div>
          </motion.div>
        </section>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-center min-h-screen">
          <p>Redirecting to your dashboard...</p>
        </div>
      </SignedIn>
    </div>
  );
}