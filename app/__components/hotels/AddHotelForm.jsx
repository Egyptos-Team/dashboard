"use client";

const AddHotelForm = ({ newHotel, setNewHotel, handleAddHotel, imageFile, setImageFile }) => {
  return (
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
      <button
        onClick={handleAddHotel}
        className="bg-[#FFFFFF] text-[#020032] cursor-pointer hover:bg-[#eeeeeec0] mt-2 py-2 rounded w-[120px] m-auto md:col-span-2"
      >
        Submit
      </button>
    </div>
  );
};

export default AddHotelForm;
