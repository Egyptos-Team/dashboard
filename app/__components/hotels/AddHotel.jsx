"use client";
import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import PutHotel from "./PutHotel";

export default function AddUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editHotel, setEditHotel] = useState(null);

  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    address: "",
    imageUrl: "",
    webSite: "",
    facebook: "",
    phoneNumber: "",
    pricePerHour: "",
    Rate: "",
    LocationName: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI";

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://egyptos.runasp.net/api/Hotels/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchName) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const nameA = `${a.name} `.toLowerCase();
      const nameB = `${b.name} `.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredUsers(filtered);
  }, [searchName, sortOrder, users]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        ` https://egyptos.runasp.net/api/Hotels/Delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id)); // حذف الـ user بناءً على الـ id
        setFilteredUsers((prev) => prev.filter((user) => user.id !== id)); // نفس الشيء مع الـ filteredUsers
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

  const handleAddHotel = async () => {
    try {
      const formData = new FormData();
      formData.append("Name", newHotel.name);
      formData.append("Location", newHotel.location);
      formData.append("Address", newHotel.address);
      formData.append("WebSite", newHotel.webSite);
      formData.append("Facebook", newHotel.facebook);
      formData.append("PhoneNumber", newHotel.phoneNumber);
      formData.append("PricePerHour", newHotel.pricePerHour);
      formData.append("Rate", newHotel.Rate);
      formData.append("LocationName", newHotel.LocationName);

      if (imageFile) {
        formData.append("ImageUrl", imageFile);
      }

      const res = await fetch("https://egyptos.runasp.net/api/Hotels/Create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(res);
      if (res.ok) {
        const added = await res.json();
        setUsers((prev) => [...prev, added]);
        setFilteredUsers((prev) => [...prev, added]);

        setShowAddForm(false);
        setNewHotel({
          name: "",
          location: "",
          address: "",
          imageUrl: "",
          webSite: "",
          facebook: "",
          phoneNumber: "",
          pricePerHour: "",
        });
        setImageFile(null);
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
              <th className="border border-gray-300">Location</th>
              <th className="border border-gray-300">address</th>
              <th className="border border-gray-300">imageUrl</th>
              <th className="border border-gray-300">webSite</th>
              <th className="border border-gray-300">facebook</th>
              <th className="border border-gray-300">phoneNumber</th>
              <th className="border border-gray-300">pricePerHour</th>
              <th className="border border-gray-300">locationName</th>
              <th className="border border-gray-300">rate</th>
              <th className="border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b text-[#FFFFFF] ">
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">
                    {user.id}
                  </td>
                  <td className="border p-2 text-center py-10 max-w-[130px] overflow-hidden  border-gray-300">
                    {user.name}
                  </td>
                  <td className="border p-2 text-center py-10 max-w-[120px]    overflow-hidden border-gray-300">
                    {user.location}
                  </td>
                  <td className="border p-2 text-center py-10 max-w-[120px]  border-gray-300">
                    {user.address}
                  </td>
                  <td className="border p-2 text-center py-10 border-gray-300">
                    <Image
                      src={`https://egyptos.runasp.net/${user.imageUrl}`}
                      width={100}
                      height={100}
                      unoptimized
                      alt={user.name}
                      className="w-16 h-16 "
                    />
                  </td>
                  <td className="border p-2 text-center max-w-[120px] overflow-hidden py-10 border-gray-300">
                    {user.webSite}
                  </td>
                  <td className="border p-2 text-center max-w-[120px] overflow-hidden py-10 border-gray-300">
                    {user.facebook}
                  </td>
                  <td className="border p-2 text-center max-w-[120px]  overflow-hidden py-10 border-gray-300">
                    {user.phoneNumber}
                  </td>
                  <td className="border p-2 text-center max-w-[150px]   overflow-hidden py-10 border-gray-300">
                    {user.pricePerHour}
                  </td>
                  <td className="border p-2 text-center  max-w-[150px]  overflow-hidden py-10 border-gray-300">
                    {user.locationName}
                  </td>
                  <td className="border p-2 text-center max-w-[150px]   overflow-hidden py-10 border-gray-300">
                    {user.rate}
                  </td>
                  <td className="px-4 py-2 m-auto  text-center">
                    <button
                      className="bg-[#C62828] text-white px-4 cursor-pointer items-center my-2 hover:bg-red-300 flex mx-1 text-[13px] py-2 rounded"
                      onClick={() => handleDelete(user.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-white inline-block mr-1" />
                      Delete
                    </button>
                    <button
                      onClick={() => setEditHotel(user)} // هنا الصح
                      className="bg-[#4D93EF] text-white px-3 cursor-pointer items-center my-2 hover:bg-[#4d93efcf] flex mx-1 text-[13px] py-2 rounded"
                    >
                      <PencilSquareIcon className="h-4 w-4 text-white inline-block mr-1" />
                      Update
                    </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-8 rounded  mt-4">
          <input
            type="text"
            placeholder="Hotel Name"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location (Map Embed URL)"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.location}
            onChange={(e) =>
              setNewHotel({ ...newHotel, location: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Address"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.address}
            onChange={(e) =>
              setNewHotel({ ...newHotel, address: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            className="block w-full border-2 text-white placeholder:pl-20 border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-[#4D93EF] focus:outline-none file:bg-[#4D93EF] file:text-white file:px-4 file:py-2 file:rounded-l-lg hover:file:bg-blue-400 transition-all"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <input
            type="text"
            placeholder="Website"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.webSite}
            onChange={(e) =>
              setNewHotel({ ...newHotel, webSite: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Facebook"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.facebook}
            onChange={(e) =>
              setNewHotel({ ...newHotel, facebook: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.phoneNumber}
            onChange={(e) =>
              setNewHotel({ ...newHotel, phoneNumber: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price Per Hour"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.pricePerHour}
            onChange={(e) =>
              setNewHotel({ ...newHotel, pricePerHour: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Rate"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.Rate}
            onChange={(e) => setNewHotel({ ...newHotel, Rate: e.target.value })}
          />

          <input
            type="text"
            placeholder="Location Name"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newHotel.LocationName}
            onChange={(e) =>
              setNewHotel({ ...newHotel, LocationName: e.target.value })
            }
          />

          <button
            onClick={handleAddHotel}
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

      {editHotel && (
        <PutHotel
          hotel={editHotel}
          onClose={() => setEditHotel(null)}
          onHotelUpdated={(updatedHotel) => {
            const updatedList = users.map((h) =>
              h.id === updatedHotel.id ? updatedHotel : h
            );
            setUsers(updatedList);
            setFilteredUsers(updatedList);
            setEditHotel(null);
          }}
        />
      )}
    </div>
  );
}
