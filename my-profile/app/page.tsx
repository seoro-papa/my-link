export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            박수한
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            안녕하세요! 제 프로필 페이지입니다.
          </p>
        </div>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            반갑습니다
          </div>
        </div>
      </main>
    </div>
  );
}
