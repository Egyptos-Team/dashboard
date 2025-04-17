"use client";
import { useEffect, useState } from "react";
import {
  ShieldExclamationIcon,
  UserIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  EyeIcon, EyeSlashIcon ,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function AddUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    sex: "",
    password: "",
    roles: [""],
  });
  const [errorMessage, setErrorMessage] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI";

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://egyptos.runasp.net/api/Users/GetAll", {
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
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredUsers(filtered);
  }, [searchName, sortOrder, users]);

  const handleDelete = async (email) => {
    const res = await fetch(
      `https://egyptos.runasp.net/api/Users/Delete/${email}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      setUsers((prev) => prev.filter((user) => user.email !== email));
      setFilteredUsers((prev) => prev.filter((user) => user.email !== email));
    } else {
      console.error("Failed to delete user from API");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleAddUser = async () => {

    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.nationalId ||
      !newUser.phoneNumber ||
      !newUser.sex ||
      !newUser.password ||
      !newUser.roles[0]
    ) {
      setErrorMessage("Please fill all fields.");
      return;
    }


    if (!validatePassword(newUser.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    try {

      const res = await fetch("https://egyptos.runasp.net/api/Users/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const added = await res.json();


        setUsers((prev) => [...prev, added]); 
        setFilteredUsers((prev) => [...prev, added]);

        setShowAddForm(false);
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          nationalId: "",
          phoneNumber: "",
          sex: "",
          password: "",
          roles: [""],
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
              <th className="border border-gray-300">PhoneNumber</th>
              <th className="border border-gray-300">NationalId</th>
              <th className="border border-gray-300">Role</th>
              <th className="border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b text-[#FFFFFF] ">
                  <td className="border p-2 py-10 text-center border-gray-300">
                    {user.id}
                  </td>
                  <td className="border p-2 text-center py-10 border-gray-300">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border p-2 text-center py-10 border-gray-300">
                    {user.email}
                  </td>
                  <td className="border p-2 text-center py-10 border-gray-300">
                    {user.phoneNumber}
                  </td>
                  <td className="border p-2 text-center py-10 border-gray-300">
                    {user.nationalId}
                  </td>
                  <td className="border p-2 text-center py-10 border-gray-300">
                    <button
                      className={`px-2 py-2 rounded-md text-center text-[13px]  text-white ${
                        user.roles == "Admin"
                          ? "bg-[#C62828]"
                          : user.roles == "TourGuide"
                          ? "bg-[#00C896]"
                          : user.roles == "User"
                          ? "bg-[#2684FF]"
                          : "bg-transparent"
                      }`}
                    >
                      {user.roles == "Admin" && (
                        <ShieldExclamationIcon className="h-4 w-4 inline-block mr-2" />
                      )}
                      {user.roles == "TourGuide" && (
                        <GlobeAltIcon className="h-4 w-4 inline-block mr-2" />
                      )}
                      {user.roles == "User" && (
                        <UserIcon className="h-4 w-4 inline-block mr-2" />
                      )}
                      {user.roles}
                    </button>
                  </td>
                  <td className="px-4 py-2 m-auto w-24 text-center">
                    <button
                      className="bg-[#C62828] text-white px-4 cursor-pointer items-center  hover:bg-red-300 flex mx-1 text-[13px] py-2 rounded"
                      onClick={() => handleDelete(user.email)}
                    >
                        <TrashIcon className="h-4 w-4 text-white inline-block mr-1" />
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
            placeholder="First Name"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newUser.firstName}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newUser.lastName}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="National ID"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newUser.nationalId}
            onChange={(e) =>
              setNewUser({ ...newUser, nationalId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newUser.phoneNumber}
            onChange={(e) =>
              setNewUser({ ...newUser, phoneNumber: e.target.value })
            }
          />
          <select
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newUser.sex}
            onChange={(e) => setNewUser({ ...newUser, sex: e.target.value })}
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className="p-2 border rounded border-white placeholder:text-white text-white w-full pr-10"
        value={newUser.password}
        onChange={(e) =>
          setNewUser({ ...newUser, password: e.target.value })
        }
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-white"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
          <select
            className="p-2 border rounded border-white placeholder:text-white text-white"
            value={newUser.roles[0]}
            onChange={(e) =>
              setNewUser({ ...newUser, roles: [e.target.value] })
            }
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="TourGuide">TourGuide</option>
            <option value="User">User</option>
          </select>

          <button
            onClick={handleAddUser}
            className="bg-[#FFFFFF] text-[#020032] cursor-pointer hover:bg-[#eeeeeec0]  mt-2 py-2 rounded w-[120px] m-auto md:col-span-2"
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
    </div>
  );
}
