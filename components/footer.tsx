import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        
        <p className="text-sm text-muted-foreground text-center">
          © 2026 FocusedAI All rights reserved.
        </p>

      </div>
    </footer>
  );
}