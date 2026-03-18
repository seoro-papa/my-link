export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24 selection:bg-accent-pink selection:text-black">
      <main className="w-full max-w-6xl space-y-12 md:space-y-20">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-accent-yellow neo-card text-sm font-black uppercase tracking-widest">
              Available for projects
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase">
              박수한<br/>
              <span className="bg-accent-cyan px-2">DEVELOPER</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold leading-tight max-w-xl">
              세상을 연결하는 개발자를 꿈꿉니다. 기술로 사람들의 일상을 더 편리하게 만드는 가치를 만듭니다.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#links" className="neo-button bg-accent-pink text-xl">
                Get in touch
              </a>
              <div className="flex -space-x-2">
                {["Next.js", "React", "TS", "Tailwind"].map((skill, i) => (
                  <div 
                    key={skill} 
                    className={`w-12 h-12 rounded-full neo-card flex items-center justify-center text-[10px] font-black
                      ${i % 3 === 0 ? "bg-accent-yellow" : i % 3 === 1 ? "bg-accent-cyan" : "bg-accent-pink"}`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="neo-card bg-accent-cyan p-8 rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-6 neo-card -rotate-6 hover:rotate-0 transition-transform duration-300">
                <p className="text-4xl font-black mb-4 italic">&quot;기술은 도구일 뿐, 중요한 건 가치입니다.&quot;</p>
                <div className="h-2 w-20 bg-black"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section id="links" className="space-y-8">
          <h2 className="text-4xl font-black uppercase tracking-tight">Connect with me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <a 
              href="https://github.com" 
              className="neo-card p-8 bg-white hover:bg-accent-yellow group"
            >
              <div className="w-16 h-16 bg-black text-white neo-card flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">GitHub</h3>
              <p className="font-bold opacity-70">프로젝트 코드와 오픈소스 기여 활동을 확인해 보세요.</p>
              <div className="mt-6 flex items-center font-black uppercase text-sm">
                Visit Profile <span className="ml-2">→</span>
              </div>
            </a>

            <a 
              href="mailto:example@email.com" 
              className="neo-card p-8 bg-white hover:bg-accent-pink group"
            >
              <div className="w-16 h-16 bg-black text-white neo-card flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">Contact</h3>
              <p className="font-bold opacity-70">협업 제안이나 궁금한 점이 있다면 언제든 메일 주세요.</p>
              <div className="mt-6 flex items-center font-black uppercase text-sm">
                Send Email <span className="ml-2">→</span>
              </div>
            </a>

            <div className="neo-card p-8 bg-accent-yellow flex flex-col justify-center items-center text-center space-y-4">
               <span className="text-6xl">🚀</span>
               <p className="font-black text-xl uppercase">More links coming soon!</p>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-12 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black uppercase tracking-tighter">
            SUHAN.DEV
          </div>
          <div className="flex gap-8 font-bold uppercase text-sm">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">Projects</a>
            <a href="#" className="hover:underline">About</a>
          </div>
          <p className="font-bold text-sm">© 2024 박수한. All rights reserved.</p>
        </footer>

      </main>
    </div>
  );
}
