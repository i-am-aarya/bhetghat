import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // alert("MIDDLEWARE CALLED")
  console.log("MIDDLEWARE CALLED")
  const token = request.cookies.get('authToken')?.value

  if(!token) {
    return
  }

  // if(token) {
  //   alert(`TOKEN FOUND:\n${token}`)
  // }

  // const requestedPath = request.nextUrl.pathname

  // if (!token) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  // const rolePaths: Record<string, string[]> = {
  //   admin: ['/admin']
  // }

  // return fetch('http://localhost:4000/api/auth/verify', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ token }),
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     const { valid, user } = data;
  //     if (!valid || !rolePaths[user.role]?.some((path) => requestedPath.startsWith(path))) {
  //       return NextResponse.redirect(new URL('/unauthorized', request.url));
  //     }
  //     return NextResponse.next();
  //   })
  //   .catch(() => NextResponse.redirect(new URL('/login', request.url)));
}

export const config = {
  matcher: ['/admin/:path*']
}