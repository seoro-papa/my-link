"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut, Link2, Copy, Check, Moon, Sun, Sparkles, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, loading, loginWithGoogle, logout } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const [linkCount, setLinkCount] = useState<number | null>(null)

  // Firestore 실시간 링크 개수 구독
  useEffect(() => {
    if (!user) {
      setLinkCount(null)
      return
    }

    const linksRef = collection(db, `users/${user.uid}/links`)
    const unsubscribe = onSnapshot(linksRef, (snapshot) => {
      setLinkCount(snapshot.size)
    }, (error) => {
      console.error("Error fetching link count:", error)
    })

    return () => unsubscribe()
  }, [user])

  const copyToClipboard = async () => {
    if (!user) return
    const publicUrl = `${window.location.origin}/users/${user.uid}`
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  // 테마 전환 토글
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800/80 py-1.5 pl-2 pr-3 rounded-2xl border border-slate-100 dark:border-zinc-800/50 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 cursor-pointer">
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
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 shadow-2xl bg-white dark:bg-zinc-950">
                  {/* 1. 사용자 정보 */}
                  <div className="flex items-center gap-3 p-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                        {user.displayName?.[0] || user.email?.[0] || "U"}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">
                        {user.displayName || "마이링크 회원"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />

                  {/* 2. 내 마이링크 주소 복사 */}
                  <DropdownMenuItem
                    onClick={copyToClipboard}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer focus:bg-slate-50 dark:focus:bg-zinc-800 transition-colors border-none outline-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <Link2 className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-zinc-300">내 마이링크 복사</span>
                    </div>
                    {copied ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-900/30 animate-in fade-in zoom-in-95 duration-200">
                        <Check className="h-3 w-3" /> 복사됨
                      </span>
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </DropdownMenuItem>

                  {/* 3. 등록된 링크 개수 */}
                  <DropdownMenuItem className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-default focus:bg-slate-50 dark:focus:bg-zinc-800 transition-colors border-none outline-none">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-zinc-300">등록된 링크</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {linkCount !== null ? `${linkCount}개` : <Loader2 className="h-3 w-3 animate-spin" />}
                    </span>
                  </DropdownMenuItem>

                  {/* 4. 테마 변경 */}
                  <DropdownMenuItem
                    onClick={toggleTheme}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer focus:bg-slate-50 dark:focus:bg-zinc-800 transition-colors border-none outline-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {resolvedTheme === "dark" ? (
                        <Sun className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Moon className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="text-sm font-medium text-slate-600 dark:text-zinc-300">
                        {resolvedTheme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground capitalize border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900">
                      {resolvedTheme}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />

                  {/* 5. 로그아웃 */}
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2.5 p-3 rounded-xl text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus:bg-destructive/10 dark:focus:bg-destructive/20 cursor-pointer transition-colors border-none outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-bold">로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
