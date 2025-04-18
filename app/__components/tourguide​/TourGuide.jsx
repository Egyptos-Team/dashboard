"use client";
import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import PutGuide from "./PutGuide";

export default function AddUsTourGuide() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editGuide, setEditGuide] = useState(null);

  const [newGuide, setNewGuide] = useState({
    salaryPerHour: "",
    description: "",
    yearsOfExperience: "",
    userId: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI";

  // دالة لجب الداتا من الـ API
  const fetchUsers = async () => {
    const res = await fetch("https://egyptos.runasp.net/api/TourGuide/GetAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setUsers(data);
    setFilteredUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchName) {
      filtered = filtered.filter((user) =>
        user.user?.firstName?.toLowerCase().includes(searchName.toLowerCase()) ||
        user.user?.lastName?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const nameA = `${a.user.firstName}`.toLowerCase();
      const nameB = `${b.user.firstName}`.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredUsers(filtered);
  }, [searchName, sortOrder, users]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        ` https://egyptos.runasp.net/api/TourGuide/Delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        fetchUsers(); // بعد الحذف، جلب البيانات من جديد
      } else {
        const errorData = await res.json();
        console.error("Failed to delete user from API:", errorData);
        setErrorMessage(
          `Failed to delete user: ${errorData?.message || "Unknown error"}`
        );
      }
    } catch (err) {
      console.error("Error during delete:", err);
      setErrorMessage("Network error, please try again later.");
    }
  };

  const handleAddGuide = async () => {
    try {
      const guideData = {
        salaryPerHour: newGuide.salaryPerHour,
        description: newGuide.description,
        yearsOfExperience: newGuide.yearsOfExperience,
        userId: newGuide.userId,
      };

      const res = await fetch("https://egyptos.runasp.net/api/TourGuide/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(guideData),
      });

      if (res.ok) {
        const added = await res.json();
        fetchUsers(); // بعد الإضافة، جلب البيانات من جديد
        setShowAddForm(false);
        setNewGuide({
          salaryPerHour: "",
          description: "",
          yearsOfExperience: "",
          userId: "",
        });
        setErrorMessage("");
      } else {
        const errorData = await res.json();
        if (errorData.errors) {
          const allErrors = Object.values(errorData.errors).flat().join(" | ");
          setErrorMessage(allErrors);
        } else {
          setErrorMessage("Something went wrong, please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error, please try again later.");
    }
  };


  return (
    <div className=" mt-7 mr-10 flex flex-col mb-6  bg-[#8894A22E]  rounded-xl space-y-6 w-[98%]">
      <div className="flex p-6 py-5  border-b-[1px] border-[#FFFFFF]">
        <h1 className="text-2xl text-[#FFFFFF]  font-bold">User Table</h1>
      </div>

      <div className="grid px-6 max-w-[800px] py-2 grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            className=" bg-[#FFFFFF21] outline-none text-white p-2 rounded-2xl pl-10"
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
          className="bg-[#FFFFFF21] outline-none w-[200px]  text-white p-2 rounded-2xl "
        >
          <option className="bg-black" value="asc">
            Sort A-Z
          </option>
          <option className="bg-black" value="desc">
            Sort Z-A
          </option>
        </select>
      </div>

      <div className="overflow-x-auto p-6 max-h-[600px] text-[13px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded  custom-scroll scrollbar-thumb-gray-500 scrollbar-track-gray-800 ">
        <table className="border-collapse border border-[#FFFFFF] shadow-sm w-full">
          <thead className=" text-[#FFFFFF]">
            <tr>
              <th className="border border-gray-300 py-5">Id</th>
              <th className="border border-gray-300">Name</th>
              <th className="border border-gray-300">Email</th>
              <th className="border border-gray-300">salary </th>
              <th className="border border-gray-300">imageUrl</th>
              <th className="border border-gray-300 px-2">Experience</th>
              <th className="border border-gray-300">rate</th>
              <th className="border border-gray-300 px-2">isAvailable</th>
              <th className="border border-gray-300 px-2 ">isActive</th>
              <th className="border border-gray-300">sex</th>
             
              <th className="border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b text-[#FFFFFF] ">
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">
                    {user.userId}
                  </td>
                  <td className="border p-2 text-center py-10 max-w-[130px] overflow-hidden  border-gray-300">
                    {user.user?.firstName} {user.user?.lastName}
                  </td>
                  <td className="border p-2 text-center py-10 max-w-[120px]    overflow-hidden border-gray-300">
                    {user.user?.email}
                  </td>
                  <td className="border p-2 text-center py-10 max-w-[120px]  border-gray-300">
                    {user.salaryPerHour}
                  </td>
                  <td className="border p-2 text-center py-10 border-gray-300">
                    <Image
                      src={`https://egyptos.runasp.net/${user?.user?.imageUrl}`}
                      width={100}
                      height={100}
                      unoptimized
                      alt={"vector image"}
                      className="w-16 h-16 "
                    />
                  </td>
                  <td className="border p-2 text-center max-w-[120px] overflow-hidden py-10 border-gray-300">
                    {user.yearsOfExperience}
                  </td>
                  <td className="border p-2 text-center max-w-[120px] overflow-hidden py-10 border-gray-300">
                    {user.rate}
                  </td>
                  <td className={`border p-2 text-center max-w-[120px]   ${
                          user.isAvailable 
                          ?"text-[#00C896] " : "text-[#C62828]" } overflow-hidden py-10 border-gray-300 `}>
                    {user.isAvailable ? "Available  " : "Not Available"}
                  </td>
                  <td className={`border p-2 text-center max-w-[150px] ${
                          user.isActive 
                          ?"text-[#00C896] " : "text-[#C62828]" }  overflow-hidden py-10 border-gray-300`}>
                    {user.isActive  ? "Active" : "Not Active"}
                  </td>
                  <td className="border p-2 text-center  max-w-[150px]  overflow-hidden py-10 border-gray-300">
                    {user.user?.sex}
                  </td>
                  
                  <td className="px-4 py-2 m-auto   text-center">
                    <div className="flex items-center justify-center">
                    <button
                      className="bg-[#C62828] text-white px-4 cursor-pointer items-center my-1 hover:bg-red-300 flex mx-1 text-[11px] py-2 rounded"
                      onClick={() => handleDelete(user.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-white inline-block " />
                      Delete
                    </button>
                    <button
                      onClick={() => setEditGuide(user)}

                      className="bg-[#4D93EF] text-white px-[14px] cursor-pointer items-center my-1 hover:bg-[#4d93efcf] flex mx-1 text-[11px] py-2 rounded"
                    >
                      <PencilSquareIcon className="h-4 w-4 text-white inline-block " />
                      Update
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan={7}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center m-auto w-[200px]">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#FFFFFF] text-[#020032] cursor-pointer mb-8 hover:bg-[#eeeeeec0] px-4 py-2 rounded"
        >
          {showAddForm ? "Close Form" : "Add User"}
        </button>
      </div>

      {showAddForm && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-8 rounded mt-4">
    <input
      type="number"
      placeholder="Salary Per Hour"
      className="p-2 border rounded border-white placeholder:text-white text-white"
      value={newGuide.salaryPerHour}
      onChange={(e) => setNewGuide({ ...newGuide, salaryPerHour: e.target.value })}
    />
    <input
      type="text"
      placeholder="Description"
      className="p-2 border rounded border-white placeholder:text-white text-white"
      value={newGuide.description}
      onChange={(e) => setNewGuide({ ...newGuide, description: e.target.value })}
    />
    <input
      type="number"
      placeholder="Years of Experience"
      className="p-2 border rounded border-white placeholder:text-white text-white"
      value={newGuide.yearsOfExperience}
      onChange={(e) => setNewGuide({ ...newGuide, yearsOfExperience: e.target.value })}
    />
    <input
      type="text"
      placeholder="User ID"
      className="p-2 border rounded border-white placeholder:text-white text-white"
      value={newGuide.userId}
      onChange={(e) => setNewGuide({ ...newGuide, userId: e.target.value })}
    />

    <button
      onClick={handleAddGuide}
      className="bg-[#FFFFFF] text-[#020032] cursor-pointer hover:bg-[#eeeeeec0] mt-2 py-2 rounded w-[120px] m-auto md:col-span-2"
    >
      Submit
    </button>
  </div>
)}

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2 md:col-span-2 text-center">
          {errorMessage}
        </div>
      )}

{editGuide && (
  <PutGuide
    guide={editGuide}
    onClose={() => setEditGuide(null)}
    onGuideUpdated={(updatedGuide) => {
      const updatedList = users.map((g) =>
        g.id === updatedGuide.id ? updatedGuide : g
      );
      setUsers(updatedList);  // تعديل الـ users بدلاً من guides
      setFilteredUsers(updatedList);  // تعديل الـ filteredUsers بدلاً من filteredGuides
      setEditGuide(null);  // إغلاق الفورم بعد التحديث
    }}
  />
)}


    </div>
  );
}
