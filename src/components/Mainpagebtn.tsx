"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

function Mainpagebtn() {
 // const { isCandidate, isLoading } = useUserRole();

  //if (isCandidate || isLoading) return null;

  return (
    <Button asChild className="gap-2 font-medium" size="sm">
      <Link href="https://saarthi-pr-201.vercel.app/Main">
        <SparklesIcon className="size-4" />
        Home
      </Link>
    </Button>
  );
}

export default Mainpagebtn;
