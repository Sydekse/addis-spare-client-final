import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    // Increased padding and container height for a "larger" feel
    <div className="flex items-center justify-center min-h-screen bg-background px-6">
      {/* Increased max-width from md to xl and added more padding */}
      <Card className="max-w-xl w-full text-center p-12 border-2 shadow-none">
        <CardHeader>
          {/* Swapped text-red-500 for text-primary and increased size */}
          <CardTitle className="text-8xl font-black text-primary tracking-tighter">
            404
          </CardTitle>
          <CardDescription className="mt-4 text-2xl font-medium text-foreground">
            Page Not Found
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6">
          {/* Removed gray-600 for standard foreground text */}
          <p className="text-foreground/80 text-xl mb-10 max-w-sm mx-auto">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          <Link href="/" passHref>
            <Button size="lg" className="px-10 py-6 text-lg font-semibold">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
