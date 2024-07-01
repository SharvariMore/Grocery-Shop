"use client"
import GlobalApi from '@/app/_utils/GlobalApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function MyOrder() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwtToken = sessionStorage.getItem('jwt');
      const userData = JSON.parse(sessionStorage.getItem('user'));
      setJwt(jwtToken);
      setUser(userData);

      if (!jwtToken) {
        router.replace('/');
      } else {
        getMyOrder(userData.id, jwtToken);
      }
    }
  }, []);

  const getMyOrder = async (userId, jwtToken) => {
    try {
      const orderList = await GlobalApi.getMyOrder(userId, jwtToken);
      console.log(orderList);
    } catch (error) {
      console.error("Error fetching order list!", error);
    }
  }

  return (
    <div>
        MyOrder
    </div>
  )
}

export default MyOrder;
