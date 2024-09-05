"use client";

import { useActionState } from "react";
import { updateProfile, State } from "@/lib/action";
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

interface IUserProfile {
  id: number;
  name: string;
  email: string;
  role?: number;
  image?: string;
  DOB?: string | null;
  phoneNum?: string | null;
  address?: string | null;
}

export default function EditProfileForm({ user }: { user: IUserProfile }) {
  // const initialState: State = { message: null, errors: {} };
  // const updateProfileWithId = updateProfile.bind(null, user.id);
  // const [state, formAction] = useActionState(updateProfileWithId, initialState);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <form action={"formAction"}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input id="name" name="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="DOB" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Input
                id="DOB"
                name="DOB"
                type="date"
                defaultValue={user.DOB || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNum" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phoneNum"
                name="phoneNum"
                type="tel"
                defaultValue={user.phoneNum || ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input
              id="address"
              name="address"
              defaultValue={user.address || ""}
            />
          </div>
          {/* {state.errors &&
            Object.entries(state.errors).map(([key, value]) => (
              <Alert variant="destructive" key={key}>
                <AlertDescription>{value}</AlertDescription>
              </Alert>
            ))}
          {state.message && (
            <Alert variant="default">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )} */}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit">Update Profile</Button>
        </CardFooter>
      </form>
    </Card>
  );
}














// --------------------------------------------------------------------------------------------

// "use client";

// import { useFormState } from "react-dom";
// import { updateProfile, State } from "@/lib/action";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { User, Mail, Calendar, Phone, MapPin } from "lucide-react";

// interface IUserProfile {
//   id: number;
//   name: string;
//   email: string;
//   role?: number;
//   image?: string;
//   DOB?: string | null;
//   phoneNum?: string | null;
//   address?: string | null;
// }

// export default function EditProfileForm({ user }: { user: IUserProfile }) {
//   const initialState: State = { message: null, errors: {} };
//   // const [state, formAction] = useFormState(updateProfile, initialState);

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>Edit Profile</CardTitle>
//       </CardHeader>
//       <form action={" "}>
//         <CardContent className="space-y-4">
//           <input type="hidden" name="id" value={user.id} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name" className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Name
//               </Label>
//               <Input id="name" name="name" defaultValue={user.name} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email" className="flex items-center gap-2">
//                 <Mail className="h-4 w-4" />
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 defaultValue={user.email}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="DOB" className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 Date of Birth
//               </Label>
//               <Input
//                 id="DOB"
//                 name="DOB"
//                 type="date"
//                 defaultValue={user.DOB || ""}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phoneNum" className="flex items-center gap-2">
//                 <Phone className="h-4 w-4" />
//                 Phone Number
//               </Label>
//               <Input
//                 id="phoneNum"
//                 name="phoneNum"
//                 type="tel"
//                 defaultValue={user.phoneNum || ""}
//               />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="address" className="flex items-center gap-2">
//               <MapPin className="h-4 w-4" />
//               Address
//             </Label>
//             <Input
//               id="address"
//               name="address"
//               defaultValue={user.address || ""}
//             />
//           </div>
//           {/* {state.errors &&
//             Object.entries(state.errors).map(([key, value]) => (
//               <Alert variant="destructive" key={key}>
//                 <AlertDescription>{value}</AlertDescription>
//               </Alert>
//             ))}
//           {state.message && (
//             <Alert variant="default">
//               <AlertDescription>{state.message}</AlertDescription>
//             </Alert> */}
//           {/* )} */}
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button
//             variant="outline"
//             type="button"
//             onClick={() => window.history.back()}
//           >
//             Cancel
//           </Button>
//           <Button type="submit">Update Profile</Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }
