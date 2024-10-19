import { DarkModeToggle } from "@/components/DarkModeToggle";
import ProfileMenu from "@/components/ProfileMenu";
import Image from "next/image";
import { getSession } from "@auth0/nextjs-auth0";
import TranscribeButton from "@/components/TranscribeButton";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="grid grid-rows-[auto_20px_1fr_20px] items-center justify-items-center min-h-screen  pb-20 gap-16  font-[family-name:var(--font-geist-sans)]">
      <header className="w-full p-4 flex items-center justify-between fixed top-0 left-0 right-0">
        <h1 className="text-xl font-bold text-center sm:text-left">
          Clip Transcriber
        </h1>
        <div className="flex flex-row gap-4 items-center">
          <DarkModeToggle />
          {!session && (
            <a
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 px-1 sm:px-6"
              href="/api/auth/login"
            >
              Login
            </a>
          )}
          {session && <ProfileMenu />}
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-3 items-center sm:items-start pt-24">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <TranscribeButton />
        </div>
      </main>
    </div>
  );
}
