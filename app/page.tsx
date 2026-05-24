"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { links as initialLinks, Link as LinkType } from "@/data/links"
import { Plus, Loader2, LogIn, Sparkles } from "lucide-react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs,
  writeBatch,
  doc
} from "firebase/firestore"
import { LinkCard } from "@/components/link-card"
import { useAuth } from "@/components/auth-provider"

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "제목은 최소 2글자 이상이어야 합니다.",
    })
    .max(20, {
      message: "제목은 최대 20글자까지 가능합니다.",
    }),
  url: z.string().url({
    message: "올바른 URL 형식을 입력해주세요. (예: https://example.com)",
  }),
})

export default function Page() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth()
  const [linkList, setLinkList] = useState<LinkType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  })

  // Firestore 실시간 구독
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const linksRef = collection(db, `users/${user.uid}/links`)
    const q = query(linksRef, orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const links = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LinkType[]

      // 데이터가 아예 없는 경우 초기 데이터 마이그레이션 실행
      if (links.length === 0 && querySnapshot.metadata.fromCache === false) {
        const snapshot = await getDocs(linksRef)
        if (snapshot.empty) {
          console.log("초기 데이터 마이그레이션을 시작합니다...")
          const batch = writeBatch(db)
          initialLinks.forEach((link) => {
            const newDocRef = doc(linksRef)
            batch.set(newDocRef, {
              title: link.title,
              url: link.url,
              icon: link.icon,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            })
          })
          await batch.commit()
          return
        }
      }

      setLinkList(links)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return

    try {
      setIsSubmitting(true)
      const parsedUrl = new URL(values.url)
      const icon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`

      await addDoc(collection(db, `users/${user.uid}/links`), {
        title: values.title.trim(),
        url: values.url.trim(),
        icon,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error adding document: ", error)
      form.setError("url", { message: "링크를 추가하는 중 오류가 발생했습니다." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1. 인증 정보 로딩 중일 때
  if (authLoading) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            인증 정보를 불러오는 중입니다...
          </p>
        </div>
      </main>
    )
  }

  // 2. 비로그인 상태일 때 (설명 화면)
  if (!user) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900">
        <div className="w-full max-w-md flex flex-col items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200/50 dark:border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="bg-primary/10 p-4 rounded-full text-primary animate-bounce">
            <Sparkles className="h-8 w-8" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">나만의 링크 공간을 만드세요</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              분산된 SNS, 블로그, 포트폴리오를 단 하나의 링크로 통합하여 아름답게 브랜딩하세요. 
              로그인 후 몇 초 만에 생성할 수 있습니다.
            </p>
          </div>

          <div className="w-full p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400 font-medium">
            💡 서비스 이용을 위해서는 먼저 Google 계정으로 로그인이 필요합니다.
          </div>

          <Button
            onClick={loginWithGoogle}
            className="w-full h-12 rounded-2xl font-bold bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] transition-all duration-300 gap-2 border-none"
          >
            <LogIn className="h-4 w-4" />
            Google 계정으로 시작하기
          </Button>
        </div>
      </main>
    )
  }

  // 3. 로그인 상태일 때 (대시보드 화면)
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start p-6 bg-slate-50 dark:bg-zinc-950">
      <div className="w-full max-w-md flex flex-col items-center gap-8 py-8 animate-in fade-in duration-500">
        {/* 프로필 정보 */}
        <div className="flex flex-col items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Profile image"}
              className="h-24 w-24 rounded-full object-cover border-2 border-primary/20 shadow-md"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-zinc-400">
              {user.displayName?.[0] || user.email?.[0] || "U"}
            </div>
          )}
          <div className="text-center">
            <h1 className="text-xl font-bold">{user.displayName || "마이링크 회원"}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* 링크 리스트 */}
        <div className="w-full flex flex-col gap-4">
          {!isLoading && (
            <div className="flex items-center justify-end px-1 mb-[-8px]">
              <div className="flex items-center gap-1.5 py-1 px-2 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Live Syncing</span>
              </div>
            </div>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="w-full h-14 rounded-2xl bg-primary hover:opacity-90 text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] hover:scale-[1.01] transition-all duration-300 border-none group px-6 mb-2"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold tracking-tight text-base">새 링크 추가하기</span>
                  <div className="bg-primary-foreground/20 p-1.5 rounded-lg group-hover:bg-primary-foreground/30 transition-colors">
                    <Plus className="h-5 w-5" />
                  </div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>새 링크 추가</DialogTitle>
                    <DialogDescription>
                      추가하고 싶은 웹사이트의 제목과 주소를 입력해주세요. 아이콘은 자동으로 가져옵니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>제목</FormLabel>
                          <FormControl>
                            <Input placeholder="예: 내 기술 블로그" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://velog.io/@messi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          추가 중...
                        </>
                      ) : (
                        "추가하기"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">링크를 불러오는 중입니다...</p>
            </div>
          ) : linkList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-2xl">
              <p className="text-sm text-muted-foreground">등록된 링크가 없습니다.<br />새로운 링크를 추가해보세요!</p>
            </div>
          ) : (
            linkList.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))
          )}
        </div>
      </div>
    </main>
  )
}
