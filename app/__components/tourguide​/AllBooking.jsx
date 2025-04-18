"use client";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AllBooking() {
  const [bookings, setBookings] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const token = "your_token_here"; // بدل التوكن هنا علشان الأمان

  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch("https://egyptos.runasp.net/api/BookingTourGuide/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      const formattedData = data.map((booking) => ({
        id: booking.id,
        tourGuideId: booking.tourGuideId,
        tourGuideFirstName: booking.tourGuideFirstName,
        tourGuideLastName: booking.tourGuideLastName,
        userId: booking.userId,
        totalPrice: booking.totalPrice,
        startBooking: new Date(booking.startBooking).toLocaleDateString(),
        endBooking: new Date(booking.endBooking).toLocaleDateString(),
        paymentDate: booking.paymentDate
          ? new Date(booking.paymentDate).toLocaleDateString()
          : "Pending",
        paymentCancel: booking.paymentCancel ? "Cancelled" : "Not Cancelled",
        cancelBooking: booking.cancelBooking ? "Cancelled" : "Not Cancelled",
      }));

      setBookings(formattedData);
    }

    fetchBookings();
  }, []);

  // فلترة وترتيب البيانات
  const filteredBookings = bookings
    .filter((b) =>
      `${b.tourGuideFirstName} ${b.tourGuideLastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = `${a.tourGuideFirstName} ${a.tourGuideLastName}`.toLowerCase();
      const nameB = `${b.tourGuideFirstName} ${b.tourGuideLastName}`.toLowerCase();
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      else return nameB.localeCompare(nameA);
    });

  return (
    <div className=" mt-7 mr-10 flex flex-col mb-6  bg-[#8894A22E]  rounded-xl space-y-6 w-[98%]">
      <div className="flex p-6 py-5  border-b-[1px] border-[#FFFFFF]">
        <h1 className="text-2xl text-[#FFFFFF]  font-bold">Booking TourGuide</h1>
       
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
          <option value="asc" className="bg-black">Sort A-Z</option>
          <option value="desc" className="bg-black">Sort Z-A</option>
        </select>
      </div>

      <div className="p-6 max-h-[600px] text-[13px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded  custom-scroll scrollbar-thumb-gray-500 scrollbar-track-gray-800">
        <table className="border-collapse border border-[#FFFFFF] shadow-sm w-full">
          <thead className=" text-[#FFFFFF] ">
            <tr>
              <th className="border border-gray-300 px-1 text-center py-2 ">Id</th>
              <th className="border border-gray-300 px-1 text-center py-2 ">Name</th>
              <th className="border border-gray-300 px-1 text-center py-2 ">Price</th>
              <th className="border border-gray-300 px-1 text-center py-2 " >Payment Date</th>
              <th className="border border-gray-300 px-1 text-center py-2 " >Payment Cancel</th>
              <th className="border border-gray-300 px-1 text-center " >Cancel Booking</th>
              <th className="border border-gray-300 px-1 text-center " >startBooking</th>
              <th className="border border-gray-300 px-1 text-center " >endBooking</th>
              <th className="border border-gray-300 px-1 text-center " >Tour Guide ID</th>
              <th className="border border-gray-300 px-1 text-center " >User ID</th>
              <th className="border border-gray-300 px-1 text-center" >Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b text-[#FFFFFF] ">
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.id}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">
                    {booking.tourGuideFirstName} {booking.tourGuideLastName}
                  </td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.totalPrice}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.paymentDate}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.paymentCancel}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.cancelBooking}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.startBooking}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300r">{booking.endBooking}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.tourGuideId}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">{booking.userId}</td>
                  <td className="border p-2 py-10 text-center max-w-[120px]  border-gray-300">
                    <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan={11}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
