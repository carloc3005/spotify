import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here if needed
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if the user should be allowed to access the page
        // For now, we'll allow all requests (you can customize this logic)
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Add paths that should be protected by authentication
    "/account/:path*",
    "/liked/:path*",
    // Add other protected routes as needed
  ],
};
