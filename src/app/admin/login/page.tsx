import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-display text-3xl font-bold">
          Must Do <span className="text-clay">City</span>
        </h1>
        <p className="mb-8 text-center text-sm text-stone-500">Administrator sign in</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
