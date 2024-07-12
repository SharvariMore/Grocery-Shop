"use client"
import GlobalApi from '@/app/_utils/GlobalApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import moment from 'moment';
import MyOrderItem from './_components/MyOrderItem';


function MyOrder() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const [orderList, setOrderList] = useState([]);
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
      const orderList_ = await GlobalApi.getMyOrder(userId, jwtToken);
      console.log(orderList_, "orderList");
      setOrderList(orderList_);
    } catch (error) {
      console.error("Error fetching order list!", error);
    }
  }

  return (
    <div>
        <h2 className='p-3 bg-primary text-xl font-bold text-center text-white'>My Order</h2>
        <div className='py-8 mx-7 md:mx-20'>
          <h2 className='text-3xl font-bold text-primary'>Order History</h2>
          <div>
            {orderList.map((order, index) => (
              <Collapsible key={index}>
              <CollapsibleTrigger>
                <div className='border p-2 bg-slate-100 flex justify-evenly gap-24 mt-3'>
                  <h2><span className='font-bold mr-2'>Order Date: </span> {moment(order?.createdAt).format('DD/MMM/yyyy')}</h2>
                  <h2><span className='font-bold mr-2'>Total Amount: </span>{order?.totalOrderAmount}</h2>
                  <h2><span className='font-bold mr-2'>Status: </span>{order?.status}</h2>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {order.orderItemList.map((item, index_) => (
                  <MyOrderItem orderItem={item} key={index_}/>
                ))}
              </CollapsibleContent>
            </Collapsible>
            ))}
          </div>  
        </div>
    </div>
  )
}

export default MyOrder;
