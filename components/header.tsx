"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut, Link2 } from "lucide-react"

export function Header() {
  const { user, loading, loginWithGoogle, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-4xl px-6 h-16 flex items-center justify-between">
        {/* 서비스 로고 */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-gradient-to-tr from-primary to-violet-600 p-2 rounded-xl text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Link2 className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            My Link
          </span>
        </div>

        {/* 우측 로그인/로그아웃 컨트롤 */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-20 animate-pulse bg-slate-100 dark:bg-zinc-800 rounded-xl" />
          ) : user ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              {/* 유저 정보 */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900/50 py-1.5 pl-2 pr-3 rounded-2xl border border-slate-100 dark:border-zinc-800/50">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User profile"}
                    className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                    {user.displayName?.[0] || user.email?.[0] || "U"}
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300 max-w-[100px] truncate">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
              </div>

              {/* 로그아웃 버튼 */}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="로그아웃"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={loginWithGoogle}
              className="rounded-xl font-semibold bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/10 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 border-none px-4"
            >
              Google 로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
