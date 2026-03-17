# GEMINI.md - Project Context

## Project Overview
This project, named **my-link**, appears to be a personal portfolio or profile management workspace. The core application is located in the `my-profile/` directory, which is a modern web application built with **Next.js** using the **App Router** architecture.

### Key Technologies
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (with @tailwindcss/postcss)
- **Fonts:** Geist Sans & Geist Mono (integrated via `next/font/google`)
- **Infrastructure:** Configured for Vercel deployment (indicated by starter templates)

## Architecture
The workspace follows a monorepo-like structure with a top-level `README.md` and a sub-project `my-profile/`.

- `my-profile/app/`: Contains the core logic, routes, and UI components using Next.js App Router.
  - `layout.tsx`: Root layout with font and global CSS integration.
  - `page.tsx`: The main entry point of the profile application.
  - `globals.css`: Global styles including Tailwind 4 directives.
- `my-profile/public/`: Static assets such as SVGs and icons.
- `my-profile/next.config.ts`: Next.js configuration.
- `my-profile/tsconfig.json`: TypeScript configuration for the sub-project.

## Building and Running
All primary development commands should be executed within the `my-profile/` directory.

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Turbopack. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## Development Conventions
- **App Router:** Follow Next.js App Router conventions (e.g., `page.tsx` for routes, `layout.tsx` for shared UI).
- **TypeScript:** Strict type checking is enabled; ensure all new components and logic are properly typed.
- **Styling:** Use Utility-first CSS with **Tailwind CSS 4**. Prefer standard Tailwind classes for responsiveness and theming.
- **Font Integration:** Utilize the CSS variables `--font-geist-sans` and `--font-geist-mono` for consistent typography.
- **Code Style:** ESLint is configured with `eslint-config-next`. Run `npm run lint` before committing changes.
