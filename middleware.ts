// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// //2-й спосіб
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import createMiddleware from "next-intl/middleware";
// import { defaultLocale, locales } from "./messages/i18nConfig";

// const intlMiddleware = createMiddleware({
//   locales: locales,
//   defaultLocale: defaultLocale,
//   alternateLinks: false,
//   localePrefix: "as-needed",
// });

// const isProtectedRoute = createRouteMatcher(["/:locale/auth(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   try {
//     // Restrict admin routes to users with specific permissions
//     if (isProtectedRoute(req)) {
//       auth().protect((has) => {
//         return (
//           has({ permission: "org:sys_memberships:manage" }) ||
//           has({ permission: "org:sys_domains_manage" })
//         );
//       });
//     }

//     // do not localize api routes
//     const path = req.nextUrl.pathname;
//     if (path.includes("/api")) {
//       return;
//     }

//     return intlMiddleware(req);
//   } catch (error) {
//     console.error("Middleware error:", error);
//     throw error; // or handle error appropriately
//   }
// });

// export const config = {
//   matcher: "/((?!static|.*\\..*|_next).*)",
// };

//3-й спосіб

import {
  clerkMiddleware,
  createRouteMatcher,
  redirectToSignIn,
} from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

import { locales, defaultLocale } from "./messages/i18nConfig";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
});

const isProtectedRoute = createRouteMatcher(["dashboard/(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  // do not localize api routes
  const path = req.nextUrl.pathname;
  if (path.includes("/api")) {
    return;
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
