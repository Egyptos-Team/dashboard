"use client";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";

const HotelTable = ({ filteredUsers, handleDelete, setEditHotel }) => {
  return (
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
                  {user.name}
                </td>
                <td className="border p-2 text-center py-10 max-w-[180px]  overflow-hidden border-gray-300">
                  {user.location}
                </td>
                <td className="border p-2 text-center py-10 border-gray-300">
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
                <td className="border p-2 text-center max-w-[200px] overflow-hidden py-10 border-gray-300">
                  {user.webSite}
                </td>
                <td className="border p-2 text-center max-w-[150px] overflow-hidden py-10 border-gray-300">
                  {user.facebook}
                </td>
                <td className="border p-2 text-center  overflow-hidden py-10 border-gray-300">
                  {user.phoneNumber}
                </td>
                <td className="border p-2 text-center  overflow-hidden py-10 border-gray-300">
                  {user.pricePerHour}
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
                    className="bg-[#4D93EF] text-white px-4 py-2 rounded hover:bg-[#3a7dcc]"
                  >
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
  );
};

export default HotelTable;
