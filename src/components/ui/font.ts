import { Inter, Lusitana, Protest_Guerrilla, Source_Sans_3 } from "next/font/google";

// Import Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// Import Lusitana font with 2 weights (400, 700) and Latin subset
const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});

 
const protestGuerrilla = Protest_Guerrilla({
  weight: ["400"],
  subsets: ["latin"],
});

export {
  inter,
  lusitana, 
  protestGuerrilla, 
};
