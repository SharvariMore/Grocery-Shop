import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function CategoryList({categoryList}) {
  return (
    <div className='mt-5'>
        <h2 className='text-green-600 font-bold text-2xl'>Shop By Category</h2>
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-5 mt-2'>
            {categoryList.map((category, index) => (
                <Link href={'/products-category/'+category.attributes.name} key={index} className='flex flex-col items-center bg-green-50 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-200'>
                    <Image src={process.env.API_URL+
                        category?.attributes?.icon?.data?.[0]?.attributes?.url}
                        alt='category' 
                        width={50} height={50}
                        className='group-hover:scale-125 transition-all ease-in-out'/>
                        <h2 className='text-green-800'>{category?.attributes?.name}</h2>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default CategoryList