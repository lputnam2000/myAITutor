import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const requireAuth: string[] = ["/home", "/getyourapikey", "/settings", "/summary"];
const redirectAuth: string[] = [];

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();
    const pathname = request.nextUrl.pathname;
    if (requireAuth.some((path) => {
        return (pathname === path)
    })) {
        const token = await getToken({
            req: request,
            secret: process.env.AUTH_SECRET,
        });
        //check not logged in

        if (!token) {
            const redirectHref = request.nextUrl.origin + `/signin`;
            return NextResponse.redirect(redirectHref);
        }
    }

    if (redirectAuth.some((path) => {
        return (pathname === path)
    })) {
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
    const response = NextResponse.next()
    console.log(request);
    console.log(response);
    return response;
}