"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useActionState } from "react";
import { createUser, CreateUserState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Calendar, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function CreateProfileForm() {
  const initialState: CreateUserState = { message: "", errors:{} };
  const [state, formAction] = useActionState(createUser, initialState);
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Profile</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input id="name" name="name" required />
              <div className="h-6">
                {state.errors?.name && (
                  <p className="text-sm text-red-500">{state.errors.name}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input id="email" name="email" type="email" required />
              <div className="h-6">
                {state.errors?.email && (
                  <p className="text-sm text-red-500">{state.errors.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="DOB" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Input id="DOB" name="DOB" type="date" required />
              <div className="h-6">
                {state.errors?.DOB && (
                  <p className="text-sm text-red-500">{state.errors.DOB}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNum" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input id="phoneNum" name="phoneNum" type="tel" required />
              <div className="h-6">
                {state.errors?.phoneNum && (
                  <p className="text-sm text-red-500">
                    {state.errors.phoneNum}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input id="address" name="address" required />
            <div className="h-6">
              {state.errors?.address && (
                <p className="text-sm text-red-500">{state.errors.address}</p>
              )}
            </div>
            {/* Role Select Field */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select id="role">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4040">Editor</SelectItem>
                  <SelectItem value="5050">Admin</SelectItem>
                  <SelectItem value="2020">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {state.message && (
            <Alert variant="default">
              <AlertDescription className="bold">
                {state.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            href="/dashboard/admin/users"
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          >
            Cancel
          </Link>
          <Button type="submit">Create Profile</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
