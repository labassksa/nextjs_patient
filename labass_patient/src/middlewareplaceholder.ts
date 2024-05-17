// /* Middleware (middleware.ts)
// This file is crucial for server-side security. It ensures that users who aren't authenticated can't access protected routes directly from the server. Before the page is rendered or any data is sent to the client, this middleware checks if the user has a valid JWT token stored in cookies. If not, it redirects them to the login page.

// Key Points:

// Prevents Unauthorized Access: By checking authentication on the server side, you ensure that unauthenticated users are redirected before they can see any sensitive content or access protected routes.
// Reduces Client-Side Checks: Since unauthenticated users are redirected at the server level, you reduce the need for some client-side checks, enhancing performance and security.*/

// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("jwtToken"); // Example of getting a token from cookies
//   const { pathname } = request.nextUrl; // Accessing the path of the current request

//   // Define the paths that require authentication
//   const protectedRoutes = ["/dashboard", "/profile", "/payment"];

//   // If the user is trying to access a protected route without a valid token, redirect them to the login page
//   if (protectedRoutes.includes(pathname) && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // If the user is authenticated or not accessing a protected route, continue as normal
//   return NextResponse.next();
// }
