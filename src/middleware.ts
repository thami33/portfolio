import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  return res
}

// Specify which routes should be handled by the middleware
export const config = {
  matcher: []
} 