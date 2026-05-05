export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  createdAt?: unknown;
}

export const links: Link[] = [
  {
    id: "1",
    title: "Instagram",
    url: "https://instagram.com/messi",
    icon: "Instagram",
  },
  {
    id: "2",
    title: "YouTube",
    url: "https://youtube.com/@messi",
    icon: "Youtube",
  },
  {
    id: "3",
    title: "Blog",
    url: "https://messi-blog.com",
    icon: "Globe",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com/messi",
    icon: "Github",
  },
  {
    id: "5",
    title: "Portfolio",
    url: "https://messi.com",
    icon: "Briefcase",
  },
];
