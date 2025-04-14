"use client";
import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // إضافة الأيقونات هنا

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

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI"; // حط التوكن بتاعك هنا

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
      setMessage("❌ كل الحقول مطلوبة");
      return;
    }
  
    if (formData.newPassword.length < 6) {
      setMessage("❌ كلمة المرور الجديدة يجب أن تكون 6 حروف على الأقل");
      return;
    }
  
    if (formData.oldPassword === formData.newPassword) {
      setMessage("❌ كلمة المرور الجديدة لا يمكن أن تكون نفسها القديمة");
      return;
    }
  
    try {
      const res = await fetch("https://egyptos.runasp.net/api/Account/ChangePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          CurrentPassword: formData.oldPassword,
          NewPassword: formData.newPassword,
        }),
      });
  
      if (res.ok) {
        setMessage("✅ تم تغيير كلمة المرور بنجاح");
        setIsEditing(false);
        setFormData({ oldPassword: "", newPassword: "" });
      } else {
        const errText = await res.text();
        throw new Error(errText || "فشل في تغيير كلمة المرور");
      }
    } catch (error) {
      console.error("فشل تغيير كلمة المرور:", error);
      setMessage("❌ فشل في تغيير كلمة المرور");
    }
  };
  

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-2xl ring-1 ring-gray-200 relative">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <PencilSquareIcon className="w-6 h-6 text-fuchsia-600" />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center text-fuchsia-600">أمان الحساب</h2>

      <div className="space-y-4">
        <Field
          label="كلمة المرور القديمة"
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
          label="كلمة المرور الجديدة"
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
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({ oldPassword: "", newPassword: "" });
              setMessage(null);
            }}
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="bg-fuchsia-600 text-white py-2 px-6 rounded hover:bg-fuchsia-700"
          >
            حفظ التعديلات
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}
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
    <label className="block mb-1 text-gray-600 font-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      readOnly={!editable}
      onChange={onChange}
      className={`w-full border px-4 py-2 rounded-lg pr-10 ${
        editable
          ? "border-fuchsia-400 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          : "bg-gray-100 border-gray-300"
      }`}
    />
    {editable && (
      <button
        type="button"
        onClick={toggleShow}
        className="absolute top-9 right-3 text-gray-500"
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
