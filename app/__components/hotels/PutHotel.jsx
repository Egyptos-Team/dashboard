"use client";
import { useState } from "react";

export default function PutHotel({ hotel, onClose, onHotelUpdated }) {
  const [formData, setFormData] = useState({
    name: hotel.name,
    location: hotel.location,
    address: hotel.address,
    webSite: hotel.webSite,
    facebook: hotel.facebook,
    phoneNumber: hotel.phoneNumber,
    pricePerHour: hotel.pricePerHour,
    Rate: hotel.rate || "",
    LocationName: hotel.locationName || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI";

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // إذا لم يتم تحديد صورة جديدة، أضف الصورة الحالية كملف
      if (imageFile) {
        data.append("ImageUrl", imageFile);
      } else if (hotel.imageUrl) {
        // استخدم الصورة القديمة كملف إذا لم يتم تحديد صورة جديدة
        const imageUrlBlob = new Blob([hotel.imageUrl], { type: "image/jpeg" });
        const file = new File([imageUrlBlob], "old_image.jpg", { type: "image/jpeg" });
        data.append("ImageUrl", file);
      }

      // طباعة البيانات المرسلة
      data.forEach((value, key) => {
        console.log(key, value);
      });

      const res = await fetch(
        `https://egyptos.runasp.net/api/Hotels/Update/${hotel.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      console.log("res", res);
      console.log("data", data);

      const contentType = res.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        setErrorMessage("");
        onClose();
        return;
      }

      if (res.ok) {
        const updatedHotel = await res.json();
        onHotelUpdated(updatedHotel);
      } else {
        const err = await res.json();
        setErrorMessage(err?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border mt-6 p-6 absolute left-[30%] top-[20%] rounded bg-black/50 z-50 shadow-xl w-1/2 backdrop-blur-md">
  <h2 className="text-white text-xl font-bold mb-4">Edit Hotel</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {["name", "location", "address", "webSite", "facebook", "phoneNumber", "pricePerHour", "LocationName", "Rate"].map((field) => (
      <input
        key={field}
        type={field === "pricePerHour" ? "number" : "text"}
        className="p-2 border rounded border-white text-white bg-transparent placeholder:text-white"
        placeholder={field}
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
      />
    ))}

    <input
      type="file"
      accept="image/*"
      className="file:bg-[#4D93EF] rounded border border-white file:text-white file:px-4 file:py-2 file:rounded-l-lg"
      onChange={(e) => setImageFile(e.target.files[0])}
    />

   <div className="flex justify-center m-auto items-center  gap-4  md:col-span-2">
   <button
      onClick={handleUpdate}
      className="bg-[#00C896] text-white px-6 py-2 rounded hover:bg-[#00c896c7] cursor-pointer mt-2 w-[200px] m-auto md:col-span-2"
      disabled={isLoading}
    >
      {isLoading ? "Saving..." : "Save Changes"}
    </button>
    <button
      onClick={onClose}
      className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 mt-2 cursor-pointer  w-[200px] m-auto md:col-span-2"
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
