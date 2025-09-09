import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { SignOut } from "@/components/signout";

export const metadata = {
  title: "Pixel Image - Work Orders",
  description: "Next.js code-test for Pixel Image",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await (await import("next-auth")).getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <header className="header-fixed text-white">
          <div className="container py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* If your logo is dark, consider using a light variant here */}
              <img
                src="https://pixel-future.com/wp-content/uploads/2021/12/footer-logo.svg"
                alt="Pixel Image"
                width={120}
                height={24}
                className="opacity-90"
              />
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/orders" className="text-white/90 hover:text-white">Orders</Link>
                <Link href="/docs" className="text-white/90 hover:text-white">Docs</Link>
              </nav>
            </div>

            <div className="text-sm flex items-center gap-3">
              {session?.user ? (
                <>
                  <span className="text-white/70">
                    Signed in as {session.user.email} ({session.user.role.toLowerCase()})
                  </span>
                  <SignOut />
                </>
              ) : (
                // Override the button colors so it fits the dark header
                <Link className="btn !bg-white !text-[#1f1844] hover:opacity-90" href="/login">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
