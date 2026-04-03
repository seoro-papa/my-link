"use client"

import { useState } from "react"
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
import { Camera, Video, Globe, Code, Briefcase, Plus } from "lucide-react"
import Link from "next/link"

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
  const [linkList, setLinkList] = useState<LinkType[]>(initialLinks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const parsedUrl = new URL(values.url)

      const newLink: LinkType = {
        id: Date.now().toString(),
        title: values.title.trim(),
        url: values.url.trim(),
        icon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
      }

      setLinkList([newLink, ...linkList])
      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      form.setError("url", { message: "유효하지 않은 URL입니다." })
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
                    <Button type="submit" className="w-full sm:w-auto">추가하기</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {linkList.map((link) => {
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
          })}
        </div>
      </div>
    </main>
  )
}
