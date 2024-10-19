import { DarkModeToggle } from "@/components/DarkModeToggle";
import ProfileMenu from "@/components/ProfileMenu";
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
      <main className="flex flex-col gap-8 row-start-3 items-center sm:items-start">
        <TranscribeButton />
      </main>
    </div>
  );
}
