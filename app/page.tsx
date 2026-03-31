import { Card } from "@/components/ui/card"
import { links } from "@/data/links"
import { Camera, Video, Globe, Code, Briefcase } from "lucide-react"
import Link from "next/link"

const iconMap: Record<string, React.ElementType> = {
  Instagram: Camera,
  Youtube: Video,
  Globe: Globe,
  Github: Code,
  Briefcase: Briefcase,
}

export default function Page() {
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
          {links.map((link) => {
            const Icon = link.icon && iconMap[link.icon] ? iconMap[link.icon] : null;

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
