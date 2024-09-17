 import NextAuth from "next-auth";
import authConfig from "./../auth.config";  
import { getToken } from "next-auth/jwt";
import { Roles } from "./lib/user-management/models/user.model";
export const getRoleName = (role) => {
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
  // ! remeove salt
  else if (req.auth && req.nextUrl.pathname.startsWith("/dashboard/admin/")) {
    const secret = process.env.AUTH_SECRET;
    const token = await getToken({
      req, secret: secret,
    });
    // console.log(token);
    const id = token?.id; 
    let roleId= token?.role;  
    // console.log("User role is ", roleId);
    if (roleId) {
    }
    const userRole = getRoleName(roleId);
    // console.log("User role is ", userRole , roleId.toString());
      if (userRole !== "Admin") {
              const newUrl = new URL("/dashboard", req.nextUrl.origin);
              return Response.redirect(newUrl);
      }  
    }
});


export const config = {
  matcher: '/dashboard/:path*',
}

