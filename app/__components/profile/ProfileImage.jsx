"use client";
import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

const tokens = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI'; // ضيف التوكين بتاعك هنا

const ProfileImage = ({ imageUrl: initialImageUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('الرجاء اختيار صورة فقط');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('حجم الصورة كبير جدًا. يرجى اختيار صورة أقل من 5MB');
        return;
      }
      setNewImage(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newImage) {
      setErrorMessage('يرجى اختيار صورة أولًا');
      return;
    }

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      const response = await fetch('https://egyptos.runasp.net/api/Account/ChangeImage', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokens}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.text();
        console.log('تم رفع الصورة بنجاح:', result);
        setSuccessMessage('✅ تم تغيير الصورة بنجاح');
        setErrorMessage(null);
        setImageUrl(URL.createObjectURL(newImage));
        setNewImage(null);

        // انتظر ثانيتين وبعدين اقفل الفورم
        setTimeout(() => {
          setIsEditing(false);
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error('فشل في رفع الصورة:', errorText);
        setErrorMessage('❌ فشل في رفع الصورة');
        setSuccessMessage(null);
      }

    } catch (error) {
      console.error('حدث خطأ أثناء رفع الصورة:', error);
      setErrorMessage('❌ حدث خطأ أثناء رفع الصورة');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="relative text-center">
      {/* صورة البروفايل */}
      <div
        className="w-32 h-32 bg-gray-200 rounded-full flex justify-center items-center relative overflow-hidden mx-auto"
        style={{
          backgroundImage: `url(${newImage ? URL.createObjectURL(newImage) : imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!newImage && !imageUrl && (
          <span className="text-white text-xl">No Image</span>
        )}
        <div
          className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <div className="p-3 bg-fuchsia-400 bg-opacity-50 rounded-full cursor-pointer">
            <PencilIcon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* زرار دائم لتغيير الصورة */}
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded shadow transition-all"
      >
        تغيير الصورة
      </button>

      {/* فورم تغيير الصورة */}
      {isEditing && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#00000096] bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center">تغيير صورة البروفايل</h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full mb-4 border-2 border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none file:bg-blue-500 file:text-white file:px-4 file:py-2 file:rounded-l-lg hover:file:bg-blue-400 transition-all"
              placeholder="اختر صورة"
              aria-label="Upload image"
            />

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
              حفظ الصورة
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrorMessage(null);
                setSuccessMessage(null);
                setNewImage(null);
              }}
              className="mt-2 text-gray-500 w-full text-center"
            >
              إلغاء
            </button>

            {/* رسائل النجاح أو الخطأ */}
            {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-sm mt-4">{successMessage}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
