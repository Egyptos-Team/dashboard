"use client";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchAndSortBar = ({ searchName, setSearchName, sortOrder, setSortOrder, users, setFilteredUsers }) => {
  useEffect(() => {
    if (users && users.length > 0) {  // التأكد من وجود البيانات
      const filteredData = users
        .filter((user) => user.name.toLowerCase().includes(searchName.toLowerCase()))
        .sort((a, b) => {
          if (sortOrder === "asc") {
            return a.name.localeCompare(b.name);  // A-Z
          } else {
            return b.name.localeCompare(a.name);  // Z-A
          }
        });

      setFilteredUsers(filteredData);
    }
  }, [searchName, sortOrder, users, setFilteredUsers]);

  return (
    <div className="grid px-6 max-w-[800px] py-2 grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <input
          type="text"
          className="bg-[#FFFFFF21] outline-none text-white p-2 rounded-2xl pl-10"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="bg-[#FFFFFF21] outline-none w-[200px] text-white p-2 rounded-2xl "
      >
        <option className="bg-black" value="asc">
          Sort A-Z
        </option>
        <option className="bg-black" value="desc">
          Sort Z-A
        </option>
      </select>
    </div>
  );
};

export default SearchAndSortBar;
