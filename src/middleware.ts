import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Events route require authentication
const isProtectedRoute = createRouteMatcher([
  '/events(.*)',
])

const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth()
  
  // Redirect authenticated users away from auth pages
  if (isAuthRoute(req) && authData.userId) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // Protect routes that require authentication
  if (isProtectedRoute(req) && !authData.userId) {
    return NextResponse.redirect(new URL('/', req.url)) 
  }

  // If user is signed in, check/set tier metadata
  if (authData.userId) {
    try {
      const client = await clerkClient()
      const user = await client.users.getUser(authData.userId)
      
      if (!user.publicMetadata?.tier) {
        console.log(`Setting default tier for user: ${authData.userId}`)
        
        await client.users.updateUserMetadata(authData.userId, {
          publicMetadata: {
            tier: 'free'
          }
        })
      }
    } catch (error) {
      console.error('Error checking/setting user tier:', error)
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}