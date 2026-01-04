// "use client";

// import React from "react";
// import Link from "next/link";
// import {
//   Facebook,
//   Twitter,
//   Instagram,
//   Phone,
//   Mail,
//   MapPin,
// } from "lucide-react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Separator } from "../ui/separator";

// export function Footer() {
//   return (
//     <footer className="bg-secondary border-t border-border mt-12">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                 <span className="text-primary-foreground font-bold">A</span>
//               </div>
//               <span className="font-bold text-lg">Addis Spare Parts</span>
//             </div>
//             <p className="text-muted-foreground">
//               Ethiopia&apos;s premier marketplace for automotive spare parts.
//               Connecting customers with trusted suppliers nationwide.
//             </p>
//             <div className="flex space-x-2">
//               <Button variant="ghost" size="sm">
//                 <Facebook className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="sm">
//                 <Twitter className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="sm">
//                 <Instagram className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="space-y-4">
//             <h3 className="font-semibold">Quick Links</h3>
//             <div className="space-y-2">
//               {[
//                 { label: "Home", href: "/" },
//                 { label: "Products", href: "/products" },
//                 { label: "Categories", href: "/categories" },
//                 { label: "About Us", href: "/about" },
//                 { label: "Contact", href: "/contact" },
//                 { label: "Help Center", href: "/help" },
//               ].map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="block text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Categories */}
//           <div className="space-y-4">
//             <h3 className="font-semibold">Popular Categories</h3>
//             <div className="space-y-2">
//               {[
//                 "Brake Parts",
//                 "Engine Components",
//                 "Filters",
//                 "Electrical Parts",
//                 "Tires & Wheels",
//                 "Suspension",
//               ].map((category) => (
//                 <Link
//                   key={category}
//                   href={`/?category=${category.toLowerCase()}`}
//                   className="block text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {category}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Contact & Newsletter */}
//           <div className="space-y-4">
//             <h3 className="font-semibold">Contact Us</h3>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2 text-muted-foreground">
//                 <Phone className="h-4 w-4" />
//                 <span>+251 911 123 456</span>
//               </div>
//               <div className="flex items-center space-x-2 text-muted-foreground">
//                 <Mail className="h-4 w-4" />
//                 <span>addissupport@sydek.dev</span>
//               </div>
//               <div className="flex items-center space-x-2 text-muted-foreground">
//                 <MapPin className="h-4 w-4" />
//                 <span>Addis Ababa, Ethiopia</span>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h4 className="font-medium">Newsletter</h4>
//               <div className="flex space-x-2">
//                 <Input placeholder="Enter your email" className="flex-1" />
//                 <Button size="sm">Subscribe</Button>
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Get updates on new products and deals
//               </p>
//             </div>
//           </div>
//         </div>

//         <Separator className="my-8" />

//         <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//           <div className="text-muted-foreground text-sm">
//             © 2025 Addis Spare Parts. All rights reserved.
//           </div>
//           <div className="flex space-x-6">
//             <Link
//               href="/privacy"
//               className="text-muted-foreground hover:text-foreground text-sm transition-colors"
//             >
//               Privacy Policy
//             </Link>
//             <Link
//               href="/terms"
//               className="text-muted-foreground hover:text-foreground text-sm transition-colors"
//             >
//               Terms of Service
//             </Link>
//             <Link
//               href="/cookies"
//               className="text-muted-foreground hover:text-foreground text-sm transition-colors"
//             >
//               Cookie Policy
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
import React from "react";
// import { assets } from "@/assets/assets";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <h1 className="text-2xl font-semibold">Addis Spare Parts</h1>
          {/* <Image className="w-28 md:w-32" src={assets.logo} alt="logo" /> */}
          <p className="mt-6 text-sm">
            Addis Spare Part, an
            e-commerce platform tailored to the Ethiopian automotive spare parts market. The
            platform is designed to make it easier for car owners, mechanics, and other buyers to
            find, compare, and purchase compatible spare parts directly from trusted suppliers
            and retailers. It offers key features such as detailed product listings, vehicle
            compatibility checks, secure payment processing, and real-time inventory
            management.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+2511-234-567</p>
              <p>info@sydek.dev</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Sydek.dev All Right Reserved.
      </p>
    </footer>
  );
};

export { Footer };