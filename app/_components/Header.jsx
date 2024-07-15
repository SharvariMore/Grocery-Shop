"use client"
import { Button } from '@/components/ui/button'
import { CircleUserRound, LayoutGrid, Search, ShoppingBag, ShoppingBasket } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GlobalApi from '../_utils/GlobalApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UpdateCartContext } from '../_context/UpdateCartContext'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import CartItemList from './CartItemList'
import { toast } from 'sonner'


function Header() {

  const [categoryList, setCategoryList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [cartItemList, setCartItemList] = useState([]);
  const router = useRouter();
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(sessionStorage.getItem('user'));
      const jwtToken = sessionStorage.getItem('jwt');
      setUser(userData);
      setJwt(jwtToken);
      setIsLogin(!!jwtToken);  // Convert to boolean
    }
    getCategoryList();
  }, []);

  useEffect(() => {
    if (user && jwt) {
      getCartItems();
    }
  }, [user, jwt, updateCart]);

  const getCategoryList = () => {
    GlobalApi.getCategory()
      .then(resp => {
        console.log("Category List: ", resp.data.data);
        setCategoryList(resp.data.data);
      })
      .catch(error => {
        console.error("Error fetching category list:", error);
      });
  }

  const onSignOut = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      router.push('/sign-in');
    }
  }

  const getCartItems = async () => {
    try {
      const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
      setTotalCartItem(cartItemList_?.length || 0);
      setCartItemList(cartItemList_);
    } catch (error) {
      console.error("Error fetching cart items!");
    }
  }

  const onDeleteItem = (id) => {
    GlobalApi.deleteCartItem(id, jwt).then(resp => {
      toast('Item Removed Successfully!')
      getCartItems();
    }, (e) => {
      toast('Unable to Remove Item!')
    })
  }

  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    let total = 0;
    cartItemList.forEach(element => {
        total = total + element.amount
    });
    setSubTotal(total.toFixed(2));
  }, [cartItemList]);

  return (
    <div className='p-5 shadow-sm flex justify-between'>
        <div className='flex items-center gap-8'>
            <Link href={'/'}>
              <Image src='/logo.png' alt='logo' width={300} height={200} className='cursor-pointer' />
            </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <h2 className='hidden md:flex gap-2 items-center boeder rounded-full p-5 px-10 bg-slate-200 cursor-pointer'>
                  <LayoutGrid className='h-5 w-5'/>Category</h2>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categoryList.map((category, index) => (
                    <Link href={'/products-category/'+category.attributes.name} key={index}>
                      <DropdownMenuItem className='flex gap-2 items-center cursor-pointer'>
                        <Image src={
                          process.env.API_URL+
                          category?.attributes?.icon?.data?.[0]?.attributes?.url
                          }
                          unoptimized={true} alt='icon' width={27} height={27}/>
                        <h2 className='text-lg'>{category?.attributes?.name}</h2>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            <div className='md:flex gap-3 items-center border rounded-full p-2 px-6 hidden'>
              <Search />
              <input type='search' placeholder='Search' className='outline-none' />
            </div>
        </div>
        <div className='flex gap-5 items-center'>  
        <Sheet>
          <SheetTrigger>
            <h2 className='flex gap-2 items-center text-lg'><ShoppingBasket className='h-7 w-7' /> 
            <span className='bg-primary text-white px-2 rounded-full'>{totalCartItem}</span> 
            </h2>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className='bg-primary text-white font-bold text-lg p-2 mt-5'>My Cart</SheetTitle>
              <SheetDescription>
                {/* <CartItemList cartItemList={cartItemList} onDeleteItem={onDeleteItem}/> */}
                {cartItemList.length === 0 ? (
                  <p className="text-center text-gray-600 mt-4 font-semibold">No items in cart!</p>
                ) : (
                  <CartItemList cartItemList={cartItemList} onDeleteItem={onDeleteItem} />
                )}
              </SheetDescription>
            </SheetHeader>
            <SheetClose asChild>
              <div className='absolute w-[90%] bottom-6 flex flex-col'>
              <h2 className='text-lg font-bold flex justify-between'>SubTotal <span>$ {subTotal}</span></h2>
              <Button onClick={() => router.push(jwt? '/checkout': '/sign-in')}>CheckOut</Button>
              </div>
            </SheetClose>
          </SheetContent>
        </Sheet>

          {!isLogin ? 
            <Link href={'/sign-in'}>
              <Button>Login</Button>
            </Link> : 
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <CircleUserRound className='bg-green-100 p-2 rounded-full text-primary h-12 w-12 cursor-pointer'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={'/'}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href={'/my-order'}>
                <DropdownMenuItem>My Order</DropdownMenuItem>
              </Link> 
              <DropdownMenuItem onClick={() => onSignOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          }
        </div>
    </div>
  )
}

export default Header