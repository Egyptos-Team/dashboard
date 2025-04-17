"use client";
import { useEffect, useState } from "react";
import { ShieldExclamationIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI";

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://egyptos.runasp.net/api/Users/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`, // إضافة التوكن في الهيدر
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
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const nameA = `${a.firstName} ${a.firstName} `.toLowerCase();
      const nameB = `${b.lastName} ${b.lastName} `.toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setFilteredUsers(filtered);
  }, [searchName, sortOrder, users]);

  const handleDelete = async (email) => {
    const res = await fetch(`https://egyptos.runasp.net/api/Users/Delete/${email}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((user) => user.email !== email));
      setFilteredUsers((prev) => prev.filter((user) => user.email !== email));
    } else {
      console.error("Failed to delete user from API");
    }
  };

  return (
    <div className="p-6 flex flex-col space-y-6   w-full ">
      <div className="flex w-full ">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full text-sm text-left border rounded shadow-sm w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-center">Id</th>
              <th className="px-4 py-2 text-center">Name</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">PhoneNumber</th>
              <th className="px-4 py-2 text-center">NationalId</th>
              <th className="px-4 py-2 text-center">Role</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">{user.id}</td>
                  <td className="px-4 py-2 text-center">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-2 text-center">{user.email}</td>
                  <td className="px-4 py-2 text-center">{user.phoneNumber}</td>
                  <td className="px-4 py-2 text-center">{user.nationalId}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`px-4 py-2 rounded-md text-center text-white ${user.roles == "Admin" ? "bg-red-500"  : user.roles == "TourGuide" ? "bg-green-500" : user.roles == "User" ? "bg-blue-500" : "bg-transparent"}`}
                    >
                      {user.roles == "Admin" && <ShieldExclamationIcon className="h-5 w-5 inline-block mr-2" />}
                      {user.roles == "TourGuide" && <GlobeAltIcon className="h-5 w-5 inline-block mr-2" />}
                      {user.roles == "User" && <UserIcon className="h-5 w-5 inline-block mr-2" />}
                      {user.roles}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-500 text-white px-4 mx-1 py-2 rounded"
                      onClick={() => handleDelete(user.email)} 
                    >
                      Delete
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
    </div>
  );
}
