"use client";
import React, { useState } from "react";
import {
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function AccountSecurity() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI"; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (!formData.oldPassword || !formData.newPassword) {
      setMessage(" All fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage(" The new password must be at least 6 characters long");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage("The new password cannot be the same as the old one");
      return;
    }

    try {
      const res = await fetch(
        "https://egyptos.runasp.net/api/Account/ChangePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            CurrentPassword: formData.oldPassword,
            NewPassword: formData.newPassword,
          }),
        }
      );

      if (res.ok) {
        setMessage(" Password changed successfully");
        setIsEditing(false);
        setFormData({ oldPassword: "", newPassword: "" });
      } else {
        const errText = await res.text();
        throw new Error(errText ||"Failed to change password");
      }
    } catch (error) {
      console.error("Password change failed:", error);
      setMessage(" Failed to change password");
    }
  };

  return (
    <div className="mt-10 mb-10 pb-3 bg-[#40434878] rounded-md relative">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 rounded-full cursor-pointer hover:bg-[#eeeeee47]"
        >
          <PencilSquareIcon className="w-6 h-6 text-[#FFFFFF]" />
        </button>
      )}

      <h2 className="font-bold mb-6 p-7 border-b text-white">
        Choose a new password
      </h2>

      <div className="space-y-5 max-w-[860px]  p-8 pb-5 pt-0">
        <Field
          label="Old password"
          name="oldPassword"
          type={showPasswords.oldPassword ? "text" : "password"}
          value={formData.oldPassword}
          onChange={handleChange}
          editable={isEditing}
          show={showPasswords.oldPassword}
          toggleShow={() =>
            setShowPasswords((prev) => ({
              ...prev,
              oldPassword: !prev.oldPassword,
            }))
          }
        />
        <Field
          label="New password"
          name="newPassword"
          type={showPasswords.newPassword ? "text" : "password"}
          value={formData.newPassword}
          onChange={handleChange}
          editable={isEditing}
          show={showPasswords.newPassword}
          toggleShow={() =>
            setShowPasswords((prev) => ({
              ...prev,
              newPassword: !prev.newPassword,
            }))
          }
        />
      </div>

      {isEditing && (
        <div className="mt-6 flex p-8 pt-0 gap-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({ oldPassword: "", newPassword: "" });
              setMessage(null);
            }}
            className="bg-[#C62828] cursor-pointer text-white py-2 px-6 rounded hover:bg-[#c62828d4]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#00C896] cursor-pointer text-white py-2 px-6 rounded hover:bg-[#00c896c7]"
          >
            Change password
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-blue-600">{message}</p>
      )}
    </div>
  );
}

const Field = ({
  label,
  name,
  value,
  onChange,
  editable,
  type = "text",
  show,
  toggleShow,
}) => (
  <div className="relative">
    <label className="block mb-1 text-white font-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      readOnly={!editable}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg pr-10 text-white placeholder:text-gray-400
        ${
          editable
            ? "border border-white bg-transparent "
            : "border border-white bg-transparent"
        }`}
    />
    {editable && (
      <button
        type="button"
        onClick={toggleShow}
        className="absolute top-[38px] right-3 text-white cursor-pointer"
      >
        {show ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    )}
  </div>
);
