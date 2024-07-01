import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function CartItemList({cartItemList, onDeleteItem}) {

  return (
    <div>
        <div className='h-[400px] overflow-auto'>
            {cartItemList.map((cart, index) => (
                <div key={index} className='flex justify-between items-center p-2 mb-5'>
                    <div className='flex gap-6 items-center'>
                        <Image src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL
                            + cart.image} 
                            alt={cart.name} height={70} width={70}
                            className='border p-2'/>
                        <div>
                            <h2 className='font-bold'>{cart.name}</h2>
                            <h2 className=''>Quantity {cart.quantity}</h2>
                            <h2 className='font-bold text-lg'>$ {cart.amount}</h2>
                        </div>
                    </div>
                    <TrashIcon className='cursor-pointer' onClick={() => onDeleteItem(cart.id)}/>
                </div>   
            ))}
        </div>
    </div>
  )
}

export default CartItemList