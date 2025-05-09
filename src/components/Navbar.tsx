import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DasboardBtn";
import Mainpagebtn from "./Mainpagebtn";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* LEFT SIDE -LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Saarthi Mentor Meet
          </span>
        </Link>
        
        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-4 ml-auto">
            <Mainpagebtn/>
            <DasboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
export default Navbar;
