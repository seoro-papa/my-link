"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card } from "@/components/ui/card"
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
import { Camera, Video, Globe, Code, Briefcase, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
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

const iconMap: Record<string, React.ElementType> = {
  Instagram: Camera,
  Youtube: Video,
  Globe: Globe,
  Github: Code,
  Briefcase: Briefcase,
}

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
    const linksRef = collection(db, "user/anonymous/links")
    const q = query(linksRef, orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const links = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LinkType[]

      // 데이터가 아예 없는 경우 초기 데이터 마이그레이션 실행
      if (links.length === 0 && querySnapshot.metadata.fromCache === false) {
        // 비어있는지 다시 한 번 확실히 확인 (getDocs)
        const snapshot = await getDocs(linksRef)
        if (snapshot.empty) {
          console.log("초기 데이터 마이그레이션을 시작합니다...")
          const batch = writeBatch(db)
          initialLinks.forEach((link, index) => {
            const newDocRef = doc(linksRef)
            // 지연 시간을 조금씩 주어 순서 보장 (createdAt 기준)
            batch.set(newDocRef, {
              title: link.title,
              url: link.url,
              icon: link.icon,
              createdAt: serverTimestamp(),
            })
          })
          await batch.commit()
          return // onSnapshot이 다시 호출될 것임
        }
      }

      setLinkList(links)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const parsedUrl = new URL(values.url)
      const icon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`

      await addDoc(collection(db, "user/anonymous/links"), {
        title: values.title.trim(),
        url: values.url.trim(),
        icon,
        createdAt: serverTimestamp(),
      })

      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error adding document: ", error)
      form.setError("url", { message: "링크를 추가하는 중 요류가 발생했습니다." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Profile Placeholder */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="text-center">
            <h1 className="text-xl font-bold">@messi</h1>
            <p className="text-sm text-muted-foreground">Creator & Developer</p>
          </div>
        </div>

        {/* Links List */}
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
            linkList.map((link) => {
              const Icon = link.icon && iconMap[link.icon] ? iconMap[link.icon] : null
              const isExternalIcon = link.icon && link.icon.startsWith("http")

              return (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                >
                  <Card className="flex items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02] transition-all cursor-pointer shadow-sm border">
                    {Icon && <Icon className="h-5 w-5 mr-4 text-primary" />}
                    {isExternalIcon && (
                      <img
                        src={link.icon}
                        alt={`${link.title} icon`}
                        className="h-5 w-5 mr-4 rounded-sm"
                      />
                    )}
                    {/* Default icon layout if none matches */}
                    {!Icon && !isExternalIcon && (
                      <Globe className="h-5 w-5 mr-4 text-muted-foreground" />
                    )}

                    <span className="font-semibold">{link.title}</span>
                  </Card>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
