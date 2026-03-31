# My Link - Project Context

This file serves as a guide for the Gemini CLI to understand the project structure and objectives, ensuring a consistent development experience.

## 1. Project Overview
- **Service Name**: My Link
- **Objective**: An integrated link service and personal branding landing page for developers and creators.
- **Core Tech Stack**:
  - **Framework**: Next.js 16 (App Router)
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS, PostCSS
  - **UI Library**: shadcn/ui (based on Radix UI)
  - **Backend/Auth**: Firebase (Auth, Firestore)
  - **Icons**: Lucide React

## 2. Key Features
- **Authentication**: Google Social Login via Firebase Auth.
- **Profile Management**: Set nickname, image, and bio.
- **Link System**: 
  - Automatic Favicon extraction and icon application upon URL entry.
  - Link CRUD (focusing on Add/Delete).
- **Specialized Embeds**:
  - **Developers**: GitHub Contributions graph, tech stack badges.
  - **Creators**: YouTube videos, Spotify playlist embeds.
- **Landing Page**: User-specific unique URLs and responsive design.

## 3. Development Guidelines

### Build and Run Commands
- `npm run dev`: Run development server (using Turbopack)
- `npm run build`: Production build
- `npm run start`: Run production build
- `npm run lint`: ESLint code check
- `npm run format`: Code formatting with Prettier (`**/*.{ts,tsx}`)
- `npm run typecheck`: TypeScript type check

### Coding Conventions and Style
- **UI Components**: Prioritize shadcn/ui components in `components/ui`. Add new components using `npx shadcn@latest add [component]`.
- **Styling**: Use Tailwind CSS and the `cn` utility in `lib/utils.ts` for dynamic class merging.
- **Directory Structure**:
  - `app/`: Next.js App Router pages and layouts.
  - `components/`: Reusable UI and domain components.
  - `hooks/`: Custom React hooks.
  - `lib/`: Utility functions and library configs (Firebase, etc.).
  - `docs/`: Project requirements (PRD), user scenarios, and documentation.

### Important Notes
- **Security**: Never commit sensitive information such as Firebase API keys in `.env` files.
- **Language**: Plans, tasks, and commit messages should be written in **Korean** (as per user preference).
- **Validation**: Always verify successful builds with `npm run build` after development.
- **References**: Always use the `@filename` format when referring to files.
