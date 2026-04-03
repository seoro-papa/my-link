"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

export default function Page() {
  const [linkList, setLinkList] = useState<LinkType[]>(initialLinks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTitle.trim() || !newUrl.trim()) return

    try {
      // Validate URL
      const parsedUrl = new URL(newUrl)
      
      const newLink: LinkType = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        url: newUrl.trim(),
        // Google Favicon Service
        icon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`
      }

      setLinkList([newLink, ...linkList])
      setIsDialogOpen(false)
      setNewTitle("")
      setNewUrl("")
    } catch (error) {
      alert("올바른 URL 형식을 입력해주세요. (예: https://example.com)")
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
              <Button variant="outline" className="w-full rounded-xl border-dashed py-6 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" />
                새 링크 추가하기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddLink}>
                <DialogHeader>
                  <DialogTitle>새 링크 추가</DialogTitle>
                  <DialogDescription>
                    추가하고 싶은 웹사이트의 제목과 주소를 입력해주세요. 아이콘은 자동으로 가져옵니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      제목
                    </Label>
                    <Input
                      id="title"
                      placeholder="예: 내 기술 블로그"
                      className="col-span-3"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://velog.io/@messi"
                      className="col-span-3"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">추가하기</Button>
                </DialogFooter>
              </form>
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
                  {(!Icon && !isExternalIcon) && <Globe className="h-5 w-5 mr-4 text-muted-foreground" />}
                  
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
