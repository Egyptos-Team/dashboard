"use client";
import React, { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const PersonalInfo = ({ fetchEndpoint }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI"; // ← غير التوكن هنا

  const editableFields = ["firstName", "lastName", "phoneNumber", "sex", "nationalId"];

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
        console.error("فشل في جلب البيانات", error);
      }
    };

    fetchData();
  }, [fetchEndpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSave = async () => {
    setMessage(null);

    if (!/^\d{14}$/.test(formData.nationalId)) {
      setMessage("⚠️ الرقم القومي يجب أن يكون 14 رقم");
      return;
    }

    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData)
          .filter(([key]) => editableFields.includes(key))
          .map(([key, value]) => {
            if (["firstName", "lastName", "sex"].includes(key) && typeof value === "string") {
              return [key, capitalize(value)];
            }
            return [key, value];
          })
      );

      const res = await fetch("https://egyptos.runasp.net/api/Account/UpdateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filteredData),
      });

      const text = await res.text();
      const updated = text ? JSON.parse(text) : formData;

      if (res.ok) {
        setUserData(updated);
        setIsEditing(false);
        setMessage("✅ تم تحديث البيانات بنجاح");
      } else {
        throw new Error(text || "فشل في التحديث");
      }
    } catch (err) {
      console.error("فشل التحديث:", err);
      setMessage("❌ فشل في تحديث البيانات");
    }
  };

  if (!userData) {
    return <p className="text-center mt-10 text-gray-500">...جاري تحميل البيانات</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-2xl ring-1 ring-gray-200 relative">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <PencilSquareIcon className="w-6 h-6 text-fuchsia-600" />
        </button>
      )}

      <h2 className="text-3xl font-bold mb-8 text-center text-fuchsia-600">بيانات الحساب</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="First Name" name="firstName" value={formData.firstName} editable={isEditing} onChange={handleChange} />
        <Field label="Last Name" name="lastName" value={formData.lastName} editable={isEditing} onChange={handleChange} />
        <Field label="Phone Number" name="phoneNumber" value={formData.phoneNumber} editable={isEditing} onChange={handleChange} />
        <Field
          label="Email"
          name="email"
          value={formData.email ? capitalize(formData.email) : ""}
          editable={false}
        />
        <Field
          label="Gender"
          name="sex"
          value={formData.sex}
          editable={isEditing}
          onChange={handleChange}
          isSelect
        />
        <Field label="Nationality" name="nationality" value={formData.nationality} editable={false} />
        <Field label="National ID" name="nationalId" value={formData.nationalId} editable={isEditing} onChange={handleChange} fullWidth />
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="bg-fuchsia-600 text-white py-2 px-6 rounded hover:bg-fuchsia-700"
          >
            حفظ التعديلات
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}
    </div>
  );
};

const Field = ({ label, name, value, editable, onChange, fullWidth, isSelect }) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <label className="block mb-1 text-gray-600 font-semibold">{label}</label>
    {editable && isSelect ? (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border px-4 py-2 rounded-lg border-fuchsia-400 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
      >
        <option value="">اختر الجنس</option>
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
        className={`w-full border px-4 py-2 rounded-lg ${editable
          ? "border-fuchsia-400 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          : "bg-gray-100 border-gray-300"
          }`}
      />
    )}
  </div>
);

export default PersonalInfo;
