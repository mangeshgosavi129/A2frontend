import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="relative w-full max-w-md">
        {/* Background glow effects */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
