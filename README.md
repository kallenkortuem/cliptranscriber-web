This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

We are using [@auth0/nextjs-auth0](https://auth0.com/docs/quickstart/webapp/nextjs) for authentication. This library provides a simple and secure way to add user login functionality to the Next.js application. It handles authentication with Auth0 and integrates seamlessly into the Next.js framework, allowing you to manage user sessions and access control with ease.

To set up authentication, follow the [Auth0 Quickstart Guide](https://auth0.com/docs/quickstart/webapp/nextjs). Additionally, use the `.env.local.example` file as a template for knowing which environment variables need to be set. Create a `.env.local` file with the correct values based on the new application created in Auth0.

## Styling and Components

We are using [Tailwind CSS](https://tailwindcss.com) and [shadcn](https://shadcn.dev) for styling and building components. Tailwind CSS provides utility-first CSS classes that allow for rapid styling, while shadcn offers a collection of beautifully designed components that integrate seamlessly with Tailwind. Together, they enable us to create consistent and visually appealing UI elements throughout the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploy on Vercel

This project is deployed to the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

When deploying on Vercel, make sure to configure the required environment variables (see Authentication) in the Vercel dashboard under the project settings.

