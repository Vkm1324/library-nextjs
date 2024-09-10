 import NextAuth from "next-auth";
import authConfig from "./../auth.config"; 
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  if (!req.auth && req.nextUrl.pathname !== "/") {
    const newUrl = new URL("/", req.nextUrl.origin);
      return Response.redirect(newUrl);
  }
  else if (req.auth && req.nextUrl.pathname.startsWith("/dashboard/admin/")) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET  });
    // console.log(token);
    const id = token?.id; 
    const role= token?.role; 
    // const id = req.auth.user.id; 
    // const role= req.auth.user.role
      console.log(role,id);
      if (role !== 5050) {
              const newUrl = new URL("/dashboard", req.nextUrl.origin);
              return Response.redirect(newUrl);
      }  
    }
});


export const config = {
  matcher: '/dashboard/:path*',
}

