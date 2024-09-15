 import NextAuth from "next-auth";
import authConfig from "./../auth.config"; 
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { Roles } from "./lib/user-management/models/user.model";
export const getRoleName = (role: number) => {
  switch (role) {
    case Roles.Admin:
      return "Admin";
    case Roles.Editor:
      return "Editor";
    case Roles.User:
      return "User";
    default:
      return "Unknown Role";
  }
};


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
    let roleId:number= token?.role; 
    // const id = req.auth.user.id; 
    // const role= req.auth.user.role
    if (roleId) {
    }
    const userRole=getRoleName(roleId);
      if (userRole !== "Admin") {
              const newUrl = new URL("/dashboard", req.nextUrl.origin);
              return Response.redirect(newUrl);
      }  
    }
});


export const config = {
  matcher: '/dashboard/:path*',
}

