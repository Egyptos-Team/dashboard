"use client";
import { useState } from "react";

export default function PutGuide({ guide, onClose, onGuideUpdated }) {
  const [formData, setFormData] = useState({
    salaryPerHour: guide.salaryPerHour || 0,
    description: guide.description || "",
    yearsOfExperience: guide.yearsOfExperience || 0,
    rate: guide.rate || 0,
    isAvailable: guide.isAvailable ?? true,
    isActive: guide.isActive ?? true,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI ";

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://egyptos.runasp.net/api/TourGuide/Update/${guide.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      console.log("Guide ID:", guide.id);
  console.log("response", formData);
      console.log("response", response);
  
      // التحقق من حالة الاستجابة
      if (response.ok) {
        const textResponse = await response.text();  // الحصول على النص بدل JSON
        console.log("Response text: ", textResponse);  // طباعة النص للاستفادة منه
        if (textResponse) {
          const updatedGuide = JSON.parse(textResponse);  // تحويل النص إلى JSON يدويًا
          onGuideUpdated(updatedGuide);
          onClose();
        } else {
          setErrorMessage("No content returned from the server.");
        }
      } else {
        const error = await response.json();
        setErrorMessage(error?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="border mt-6 p-6 absolute left-[30%] top-[20%] rounded bg-black/50 z-50 shadow-xl w-1/2 backdrop-blur-md">
      <h2 className="text-white text-xl font-bold mb-4">Edit Tour Guide Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Salary Per Hour"
          className="p-2 border rounded border-white text-white bg-transparent placeholder:text-white"
          value={formData.salaryPerHour}
          onChange={(e) => setFormData({ ...formData, salaryPerHour: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded border-white text-white bg-transparent placeholder:text-white"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Years of Experience"
          className="p-2 border rounded border-white text-white bg-transparent placeholder:text-white"
          value={formData.yearsOfExperience}
          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rate"
          className="p-2 border rounded border-white text-white bg-transparent placeholder:text-white"
          value={formData.rate}
          onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
        />

        <label className="text-white">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
          />{" "}
          Available
        </label>

        <label className="text-white">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />{" "}
          Active
        </label>

        <div className="flex justify-center m-auto items-center gap-4 md:col-span-2">
          <button
            onClick={handleUpdate}
            className="bg-[#00C896] text-white px-6 py-2 rounded hover:bg-[#00c896c7] cursor-pointer mt-2 w-[200px]"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 mt-2 cursor-pointer w-[200px]"
          >
            Cancel
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-500 mt-3 text-center">{errorMessage}</div>
      )}
    </div>
  );
}
