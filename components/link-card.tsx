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
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Pencil, Trash2, Globe, Check, X, Loader2 } from "lucide-react"
import { Link as LinkType } from "@/data/links"
import { db } from "@/lib/firebase"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"

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

interface LinkCardProps {
  link: LinkType
}

export function LinkCard({ link }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  })

  const onEdit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const parsedUrl = new URL(values.url)
      const icon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`

      const docRef = doc(db, "users/anonymous/links", link.id)
      await updateDoc(docRef, {
        title: values.title.trim(),
        url: values.url.trim(),
        icon,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating document: ", error)
      form.setError("url", { message: "수정 중 오류가 발생했습니다." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsSubmitting(true)
      const docRef = doc(db, "users/anonymous/links", link.id)
      await deleteDoc(docRef)
      setIsDeleting(false)
    } catch (error) {
      console.error("Error deleting document: ", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isExternalIcon = link.icon && link.icon.startsWith("http")

  if (isEditing) {
    return (
      <Card className="p-5 border-2 border-primary/50 shadow-lg bg-white dark:bg-zinc-900 rounded-2xl animate-in fade-in zoom-in duration-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEdit)} className="space-y-4">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="링크 제목" 
                        {...field} 
                        className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-800 border-none focus-visible:ring-2 focus-visible:ring-primary/30" 
                      />
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
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-800 border-none focus-visible:ring-2 focus-visible:ring-primary/30" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  form.reset()
                }}
                disabled={isSubmitting}
                className="rounded-xl px-4"
              >
                <X className="h-4 w-4 mr-1.5" />
                취소
              </Button>
              <Button 
                type="submit" 
                size="sm" 
                disabled={isSubmitting}
                className="rounded-xl px-4 shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Check className="h-4 w-4 mr-1.5" />
                )}
                저장하기
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    )
  }

  return (
    <div className="group relative flex items-center w-full">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl overflow-hidden"
      >
        <Card className="flex items-center p-4 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:scale-[1.01] transition-all duration-300 cursor-pointer shadow-sm border border-slate-200 dark:border-zinc-800 h-16 rounded-2xl">
          <div className="flex items-center flex-1 min-w-0 pr-24">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-800 mr-4 flex-shrink-0 border border-slate-100 dark:border-zinc-700">
              {isExternalIcon ? (
                <img
                  src={link.icon}
                  alt={`${link.title} icon`}
                  className="h-5 w-5 rounded-sm object-contain"
                />
              ) : (
                <Globe className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 truncate tracking-tight">{link.title}</span>
          </div>
        </Card>
      </a>

      {/* Action Buttons - Always Visible */}
      <div className="absolute right-3 flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-200"
          onClick={() => setIsEditing(true)}
          title="수정"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          onClick={() => setIsDeleting(true)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold tracking-tight">정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
                    {isExternalIcon ? (
                      <img src={link.icon} alt="" className="h-4 w-4" />
                    ) : (
                      <Globe className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <span className="font-semibold text-foreground truncate">&quot;{link.title}&quot;</span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                  <span className="text-red-500 font-bold text-sm">이 작업은 되돌릴 수 없습니다.</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleting(false)}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl h-11 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl h-11 shadow-lg shadow-destructive/20"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : null}
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
