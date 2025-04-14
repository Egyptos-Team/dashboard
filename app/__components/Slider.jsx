"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(1);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const pathname = usePathname();

  const navLinks = [
    { name: "All User", href: "/user", icon: UserIcon },
    { name: "Profile", href: "/account", icon: LockClosedIcon },
    { name: "الإعدادات", href: "/user", icon: UserIcon },
  ];

  return (
    <div className="flex flex-row-reverse justify-end ">
      <div
        className={`bg-amber-500 h-lvh duration-300 py-2 ${
          isOpen ? "w-[200px]" : "w-[80px]"
        }`}
      >
        <div
          onClick={toggleSidebar}
          className="text-3xl cursor-pointer text-end pr-4 text-[#2a2185]"
        >
          <div> ☰ </div>
        </div>

        <div className=" overflow-hidden px-3 flex py-3 items-center  pl-4  pb-3 border-b-1 ">
          <Image
            src={"/download.jpeg"}
            alt="Description of the image"
            width={50}
            height={50}
            className="rounded-full bg-contain "
          />
          <h1 className={` ${isOpen ? "block" : "hidden"} pl-2     `}>dfdf</h1>
        </div>
        <div>
          <ul className="space-y-2 pt-2 pl-3">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;

              return (
                <li
                  key={index}
                  className={`duration-300 p-2 pl-4 py-3 rounded-l-full flex items-center
                  ${isActive ? "bg-white text-[#2a2185]" : ""}
                hover:bg-white hover:text-[#2a2185] hover:rounded-tr-4xl hover:rounded-br-3xl`}
                >
                  <Link
                    href={link.href}
                    className="flex items-center w-full gap-2"
                  >
                    <div className="border-[1px] rounded-full flex items-center justify-center w-8 h-8">
                      <link.icon
                        className={`w-5 h-5 inline-block ${
                          isActive ? "text-[#2a2185]" : "text-black"
                        }`}
                      />
                    </div>
                    <span className={`${isOpen ? "block" : "hidden"}`}>
                      {link.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
