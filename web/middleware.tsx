import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./pages/api/auth/[...nextauth]"
import { getToken } from "next-auth/jwt";

const requireAuth: string[] = ["/home"];
const redirectAuth: string[] = [];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    //check not logged in
    
    if (!token) {
      const url = new URL(request.nextUrl.host + `/api/auth/signin`);
      return NextResponse.redirect(url.href);
    }
  }
  
  if (redirectAuth.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    //check if logged in
    if (token) {
      const url = new URL(`/home`, request.url);
      return NextResponse.redirect(url);
    }
  }
  return res;
}