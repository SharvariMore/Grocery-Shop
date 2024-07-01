"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function SignIn() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loader, setLoader] = useState();
  const router = useRouter();

  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
        router.push('/')
    }
  }, []);

  const  onSignIn = () => {
    setLoader(true);
    GlobalApi.SignIn(email, password).then(resp => {
        console.log(resp.data.user);
        console.log(resp.data.jwt);
        sessionStorage.setItem('user', JSON.stringify(resp.data.user));
        sessionStorage.setItem('jwt', resp.data.jwt);
        toast("Login Successfull!")
        router.push('/')
        setLoader(false)
    }, (e) => {
        toast(e?.response?.data?.error?.message)
        setLoader(false)
    })
  }

  return (
    <div className='flex items-baseline justify-center my-20'>
        <div className='flex flex-col items-center justify-center p-10 bg-slate-200'>
            <Image src='/logo.png' width={200} height={200} alt='account' />
            <h2 className='font-bold text-3xl'>Sign In To Account</h2>
            <h2 className='text-gray-500'>Enter Your Email and Password to Sign In To Account</h2>
            <div className='w-full flex flex-col gap-5 mt-7'>
                <Input placeholder='name@example.com' 
                onChange={(e) => setEmail(e.target.value)}/>
                <Input type='password' placeholder='Password' 
                onChange={(e) => setPassword(e.target.value)}/>
                <Button onClick={() => onSignIn()} disabled={!(email || password)}>
                    {loader ? <LoaderIcon className='animate-spin'/> : 'Sign In'}
                </Button>
                <p>Don't Have An Account? 
                    <Link href={'/create-account'} className='text-blue-500'>
                        Click Here to Create New Account
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default SignIn