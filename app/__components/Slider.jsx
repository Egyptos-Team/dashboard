// components/Sidebar.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { ChevronRightIcon ,ChevronLeftIcon ,BuildingOfficeIcon } from "@heroicons/react/24/solid";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    // const token = localStorage.getItem("token");
    // if (!token) return;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI";

    try {
      const res = await fetch(
        "https://egyptos.runasp.net/api/Account/Profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const pathname = usePathname();

  const navLinks = [
    { name: "All User", href: "/user", icon: UserIcon },
    { name: "Profile", href: "/account", icon: LockClosedIcon },
    { name: "hotel", href: "/hotel", icon: BuildingOfficeIcon },
    { name: "الإعدادات", href: "/user", icon: UserIcon },
  ];

  return (
    <div className="flex flex-row-reverse p-6 bg-black transition-transform  justify-end">
      <div
        className={`bg-[#40434878]  rounded-2xl py-6 h-lvh duration-500  px-2 ${
          isOpen ? "w-[200px]" : "w-[90px]"
        }`}
      >
        <div
          onClick={toggleSidebar}
          className="text-3xl cursor-pointer text-end relative right-[-35px] pr-4  text-[#2a2185]"
        >
          <div className="absolute right-3  top-1 bg-[#2684FF] p-1 rounded-full"> {isOpen ?<ChevronLeftIcon className="w-6 h-6 font-extrabold text-white" />:<ChevronRightIcon className="w-6 h-6 font-extrabold text-white" />} </div>
        </div>

        <div className="overflow-hidden   items-center pl-3 pb-3 border-b-1">
          {profile && (
            <div className="flex items-center">
              <Image
                src={`https://egyptos.runasp.net/${profile.imageUrl}`} 
                alt="User"
                width={50}
                height={50}
                unoptimized
                className="rounded-full w-[40px] h-[40px] bg-contain"
              />
              <div>
                <h1
                  className={` ${
                    isOpen ? "block" : "hidden "
                  } pl-2 text-white font-bold text-[14px] `}
                >
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className={`text-[11px] pl-2 text-[#FFFFFF75] ${
                    isOpen ? "block" : "hidden "
                  } `}>
                  {profile.email}
                </p>
              </div>
            </div>
          )}
          <div className="border-0 mt-8 border-transparent w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-lg"></div>
        </div>

        <div>
          <ul className="space-y-2 pt-2 px-3">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;

              return (
                <li
                  key={index}
                  className={`duration-300 p-2  py-3 rounded-xl flex items-center
                  ${isActive ? "bg-[#FFFFFF1C] text-[#2a2185]" : ""}
                hover:bg-[#FFFFFF1C] hover:text-[#2a2185]  hover:rounded-xl`}
                >
                  <Link
                    href={link.href}
                    className="flex items-center w-full gap-2"
                  >
                    <div className=" flex items-center justify-center w-8 h-8">
                      <link.icon
                        className={`w-7 h-7 inline-block ${
                          isActive ? "text-[#2684FF]" : "text-[#2684FF]"
                        }`}
                      />
                    </div>
                    <span className={` text-[#FFFFFF] ${isOpen ? "block" : "hidden"}`}>
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
