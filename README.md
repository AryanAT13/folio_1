# Interactive Developer Portfolio

This is my personal corner of the internet, built from scratch to showcase my work and projects. This portfolio is a project in itself, featuring a custom, interactive guestbook, an AI chatbot, and unique animated backgrounds.

**Live Demo:** [**https://folio-1-ten.vercel.app/**](https://folio-1-ten.vercel.app/)

## Key Features

- **Interactive Guestbook:** Users can sign in with their GitHub account to leave a message and a drawable signature. The guestbook updates in real-time and prevents duplicate entries.
- **AI Chatbot:** An integrated chatbot powered by the Cohere API to answer questions.
- **Dynamic UI:** Features several custom-built, animated backgrounds and subtle text animations for a modern and unique feel.
- **Fully Responsive:** Designed with Tailwind CSS to be fully functional and look great on all devices, from mobile phones to desktops.
- **Dark Mode:** Includes a theme toggle for a comfortable viewing experience.

## Tech Stack

This project was a deep dive into modern full-stack development, integrating a variety of powerful tools and services.

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** Turso (libSQL)
- **Authentication:** NextAuth.js (GitHub Provider)
- **Animations:** HTML Canvas, Lottie, CSS Animations
- **AI:** LangChain, Cohere
- **Deployment:** Vercel

## Getting Started

To run this project on your local machine, you'll need to set up the required environment variables.

### Environment Setup

Create a file named `.env` in the root of the project and add the following variables.

```env
# Turso Database Credentials
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# NextAuth.js Variables
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET=
NEXTAUTH_URL="http://localhost:3000"

# Cohere API Key (for the chatbot)
COHERE_API_KEY=

# EmailJS Credentials (for the contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
