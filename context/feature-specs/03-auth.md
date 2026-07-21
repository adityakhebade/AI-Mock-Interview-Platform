I want to change the authentication flow of my Next.js application using Clerk.

Current behavior:
- When the application starts, it immediately redirects users to the Clerk sign-in page.
- This is not the desired behavior.

Desired behavior:
1. The landing page (/) should be completely public.
2. Users should be able to browse the homepage without logging in.
3. Authentication should only be required when accessing protected pages such as:
   - /dashboard
   - /interview
   - /profile
   - /settings
   - any other authenticated routes
4. When an unauthenticated user clicks a protected action (e.g. "Start Interview", "Dashboard", "Profile"), they should be redirected to the Clerk Sign In page.
5. After successful login, the user should be redirected back to the page they originally requested.
6. Do not break the existing Clerk authentication setup.
7. Update the Clerk middleware and route protection to make only the required routes protected while keeping the landing page public.
8. Explain every file that was modified and why.

Please inspect the existing middleware, layout, and routing before making changes. Reuse the existing architecture instead of rewriting it.