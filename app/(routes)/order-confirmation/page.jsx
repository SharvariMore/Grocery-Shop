import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'

function OrderConfirmation() {
  return (
    <div className='flex justify-center my-20'>
        <div className='border shadow-md flex flex-col justify-center p-20 rounded-md items-center gap-3 px-32 '>
            <CheckCircle2 className='h-24 w-24 bg-primary' />
            <h2 className='font-medium text-3xl text-primary'>Order Successfull!</h2>
            <h2 className=''>Thank You So Much For Order</h2>
            <Button className='mt-8'>Track Your Order</Button>
        </div>
    </div>
  )
}

export default OrderConfirmation