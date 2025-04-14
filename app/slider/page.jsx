"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(1);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-row-reverse justify-end ">
       <div
          onClick={toggleSidebar}
          className="text-3xl cursor-pointer text-[#2a2185]"
        >
          <div> ☰ </div>
          <div>sdfsds</div>
        </div>

      <div
        className={`bg-amber-500 h-lvh duration-300 py-2 ${
          isOpen ? "w-[200px]" : "w-[80px]"
        }`}
      >
       
        <div className=" overflow-hidden px-3 flex py-3 items-center  pl-4  pb-3 border-b-1 ">
          <Image
            src={"/download.jpeg"}
            alt="Description of the image"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h1 className={` ${isOpen ? "block" : "hidden"} pl-2     `}>dfdf</h1>
        </div>
        <div>
          <ul className=" space-y-2 pt-2  pl-3">
            <li
              className="hover:bg-white ;
                 duration-300 hover:rounded-tr-4xl hover:rounded-br-3xl hover:text-[#2a2185] p-2 pl-4 py-3 rounded-l-full flex items-center"
            >
              <span className="text-xl">📊</span>
              {isOpen && <span className="ml-2">Dashboard</span>}
            </li>
            <li
              className="hover:bg-white ;
                 duration-300 hover:rounded-tr-4xl hover:rounded-br-3xl pl-4 hover:text-[#2a2185] p-2 py-3 rounded-l-full flex items-center"
            >
              <span className="text-xl">📊</span>
              {isOpen && <span className="ml-2">Dashboard</span>}
            </li>
            <li
              className="hover:bg-white ;
                 duration-300 hover:rounded-tr-4xl hover:rounded-br-3xl pl-4 hover:text-[#2a2185] p-2 py-3 rounded-l-full flex items-center"
            >
              <span className="text-xl">📊</span>
              {isOpen && <span className="ml-2 ">Dashboard</span>}
            </li>
            {/* يمكن إضافة المزيد من العناصر هنا */}
          </ul>
        </div>
      </div>
    </div>
  );
}
