"use client";
import React, { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const PersonalInfo = ({ fetchEndpoint }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI"; // ← غير التوكن هنا

  const editableFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "sex",
    "nationalId",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fetchEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (data) {
          setUserData(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [fetchEndpoint]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);
  
      return () => clearTimeout(timer); 
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSave = async () => {
    setMessage(null);

    if (!/^\d{14}$/.test(formData.nationalId)) {
      setMessage("⚠️ The national ID number must be 14 digits");
      return;
    }

    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData)
          .filter(([key]) => editableFields.includes(key))
          .map(([key, value]) => {
            if (
              ["firstName", "lastName", "sex"].includes(key) &&
              typeof value === "string"
            ) {
              return [key, capitalize(value)];
            }
            return [key, value];
          })
      );

      const res = await fetch(
        "https://egyptos.runasp.net/api/Account/UpdateProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(filteredData),
        }
      );

      const text = await res.text();
      const updated = text ? JSON.parse(text) : formData;

      if (res.ok) {
        setUserData(updated);
        setIsEditing(false);
        setMessage(" Data updated successfully");
      } else {
        throw new Error(text || "Failed to update");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setMessage(" Failed to update data");
    }
  };

  if (!userData) {
    return (
      <p className="text-center mt-10 text-gray-500">...Loading data</p>
    );
  }

  return (
    <div className=" w-full   p-8 pt-3   relative">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:cursor-pointer hover:bg-[#eeeeee58]"
        >
          <PencilSquareIcon className="w-6 h-6 text-[#FFFFFF] " />
        </button>
      )}
      <div className="w-[800px]  max-[900px]:w-full">
      <div className="grid grid-cols-1 mb-5 sm:grid-cols-2 gap-6">
        <div className=" ">
          <label className="block mb-2  text-white ">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-transparent border-[1px] border-white rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-white ">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-transparent border-[1px] border-white rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-white ">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-transparent border-[1px] border-white rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-white ">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email ? capitalize(formData.email) : ""}
            readOnly
            className="w-full px-4 py-2 bg-transparent border-[1px] border-white rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block mb-2  text-white ">Gender</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full px-4 py-[10px] bg-transparent border-[1px] border-white rounded-lg text-white"
          >
            <option value="">Choose Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-white ">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            readOnly
            className="w-full px-4 py-2 bg-transparent border-[1px] border-white rounded-lg text-white"
          />
        </div>
       
      </div>
      <div className="w-full">
          <label className="block mb-1 text-white">National ID</label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-transparent border border-white rounded-lg text-white"
          />
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex   gap-4">
          
          <button
            onClick={handleSave}
            className="bg-[#00C896] text-white py-2 px-6 hover:cursor-pointer rounded hover:bg-[#00c896af]"
          >
            Save Changes 
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-[#C62828] text-white py-2 px-6 cursor-pointer rounded hover:bg-[#c62828b6]"
          >
            Cancel
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-green-700 ">{message}</p>
      )}
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  editable,
  onChange,
  fullWidth,
  isSelect,
}) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <label className="block mb-1 text-gray-600 font-semibold">{label}</label>
    {editable && isSelect ? (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border px-4 py-1.5 rounded-lg border-[#40434878] bg-[#40434878] text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
      >
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    ) : (
      <input
        type="text"
        name={name}
        value={value || ""}
        readOnly={!editable}
        onChange={onChange}
        className={`w-full border px-4 py-1.5 rounded-lg ${
          editable
            ? "border-[#40434878] bg-[#40434878] text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            : "bg-gray-100 border-gray-300"
        }`}
      />
    )}
  </div>
);

export default PersonalInfo;
