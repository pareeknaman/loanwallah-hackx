import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // These are the routes that anyone can access, even if not logged in.
  publicRoutes: [
    '/', // The Home page
    '/about', // The About Us page
    '/sign-in', // The Sign In page
    '/sign-up', // The Sign Up page
    '/api/upload', // The PDF upload API
    '/api/chat' // Our main chat API
  ]
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
