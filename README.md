# OnPoint Talent

A job board prototype built with Next.js, TypeScript, and Tailwind CSS. Connects job seekers with employers — no backend required; all data is stored in `localStorage`.

---

## Features

- **Job seekers** — browse listings, apply with a cover letter and PDF resume, manage their profile
- **Employers** — post jobs, view applicants per listing, update application statuses (pending / interview / rejected), download resumes
- **Auth** — sign up / log in as seeker or employer; role-aware navigation and redirects
- **Dark mode** — system-aware with manual toggle

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 or later |
| npm | 9 or later (comes with Node) |

Check your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd onpoint-talent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── about/
│   ├── employer/         # Employer dashboard
│   ├── for-employers/
│   ├── jobs/             # Job listings
│   ├── login/
│   ├── post-job/
│   ├── pricing/
│   ├── profile/          # Seeker profile editor
│   └── signup/
├── components/
│   ├── auth/             # LoginForm, SignupForm
│   ├── employer/         # EmployerDashboard
│   ├── home/             # Navbar, HeroSection, Footer, CtaBanner
│   ├── jobs/             # JobListings, PostJobForm
│   └── seeker/           # ProfileEditor
├── context/
│   └── AuthContext.tsx   # Auth state + useAuth hook
├── lib/
│   └── extractSkills.ts  # Keyword skill extraction for job posts
└── types/
    └── index.ts          # Shared TypeScript types
```

---

## localStorage Keys

All data lives in the browser — no database or API calls needed.

| Key | Contents |
|-----|----------|
| `onpoint_users` | Registered user accounts |
| `onpoint_session` | Currently logged-in user |
| `onpoint_jobs` | Posted job listings |
| `onpoint_applications` | Job applications (with base64 resume) |
| `onpoint_profiles` | Seeker profile data |
| `theme` | `"dark"` or `"light"` preference |

To reset all data, open DevTools → Application → Local Storage and clear the keys above.

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) — icons

---

## Notes

- Passwords are stored in plaintext in `localStorage` — this is a prototype only, not for production use.
- Resume files are stored as base64 data URIs in `localStorage`. Large PDFs (>1–2 MB) may approach storage limits in some browsers.
- No `.env` file is needed to run this project.
