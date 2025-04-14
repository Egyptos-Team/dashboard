"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProfileImage from '../__components/profile/ProfileImage';
import PersonalInfo from '../__components/profile/PersonalInfo';
import AccountSecurity from '../__components/profile/AccountSecurity';
export default function Page() {
  const [profileData, setProfileData] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGIyZjkxZC05ZTEyLTRmNGEtYjNkYi0xYjU4ZmNhMTVlNjYiLCJlbWFpbCI6ImFkbWluQGVneXB0b3MuY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImp0aSI6IjAxOTU5MGEzLTBjMTAtNzAxMS04YjY4LTliYzFiZjBiZDVjYiIsInJvbGVzIjpbIkFkbWluIl0sImV4cCI6MTc3MzQyNDM1OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTcwIn0.bUlzZPE554JixkDZpz4cBmP_lyzDJeJ016tnStcR8zI'; 

        const response = await fetch('https://egyptos.runasp.net/api/Account/Profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          },
        });

        if (!response.ok) {  
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setProfileData(result);  
      } catch (error) {
        setError(error.message);  
      } finally {
        setLoading(false);  
      }
    };

    fetchData();  
  }, []);  

  if (loading) {
    return <div>Loading...</div>;  
  }

  if (error) {
    return <div>Error: {error}</div>;  
  }

  return (
    <div className='w-full'>
      <h1>Account Setting</h1>
      <div>
        <div>
          <div className='bg-gray-500 my-5 border-b-8 border-b-blue-700'>
            <h2>Basic Info</h2>
            <p>Profile Picture</p>
            <ProfileImage  imageUrl={`https://egyptos.runasp.net/${profileData?.imageUrl}`} />
          </div>
          <div className='flex  justify-evenly'>
                <PersonalInfo fetchEndpoint={`https://egyptos.runasp.net/api/Account/Profile`} />
          </div>
          <div>
            <AccountSecurity/>
          </div>
        </div>
      </div>
    </div>
  );
}
