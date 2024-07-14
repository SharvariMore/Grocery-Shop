"use client"
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { ArrowBigRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function Checkout() {
    const [totalCartItem, setTotalCartItem] = useState(0);
    const [cartItemList, setCartItemList] = useState([]);
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);
    const [subTotal, setSubTotal] = useState(0);
    const router = useRouter();
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [zip, setZip] = useState();
    const [address, setAddress] = useState();
    const [totalAmount, setTotalAmount] = useState();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = JSON.parse(sessionStorage.getItem('user'));
            const jwtToken = sessionStorage.getItem('jwt');
            setUser(userData);
            setJwt(jwtToken);
            if (userData && jwtToken) {
                getCartItems(userData.id, jwtToken);
            } else if (!jwtToken) {
                router.push('/sign-in')
            }

        }
    }, []);

    const getCartItems = async (userId, jwtToken) => {
        try {
            const cartItemList_ = await GlobalApi.getCartItems(userId, jwtToken);
            console.log(cartItemList_, "items");
            setTotalCartItem(cartItemList_?.length || 0);
            setCartItemList(cartItemList_);
        } catch (error) {
            console.error("Error fetching cart items!");
        }
    };

    useEffect(() => {
        let total = 0;
        cartItemList.forEach(element => {
            total = total + element.amount
        });
        setSubTotal(total.toFixed(2));
        setTotalAmount((total * 0.9 + 15).toFixed(2));
    }, [cartItemList]);

    const calculateTotalAmount = () => {
        const totalAmount = subTotal * 0.9 + 15;
        return totalAmount.toFixed(2);
    }

    const validateUserName = (name) => /^[a-zA-Z\s]{0,50}$/.test(name);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

    const validateZip = (zip) => /^[0-9]{6}$/.test(zip);

    const onApprovePayment = (data) => {
        console.log(data, "data");

        if (!validateUserName(userName)) {
            toast.error('Please enter a valid name up to 50 characters!');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Invalid email format!');
            return;
        }

        if (!validatePhone(phone)) {
            toast.error('Please enter a valid 10-digit phone number!');
            return;
        }

        if (!validateZip(zip)) {
            toast.error('Please enter a valid zip code!');
            return;
        }


        const payload = {
            data: {
                paymentId: (data.paymentId).toString(),
                totalOrderAmount: totalAmount,
                username: userName,
                email: email,
                phone: phone,
                zip: zip,
                address: address,
                orderItemList: cartItemList,
                userId: user.id
            }
        }
        GlobalApi.createOrder(payload, jwt).then(resp => {
            toast('Order Placed Successfully!');
            cartItemList.forEach((item) => {
                GlobalApi.deleteCartItem(item.id, jwt).then(resp => {
                    console.log(resp);
                })
            })
            router.replace('/order-confirmation');
        })

    }

    const handlePhoneChange = (e) => {
        let validatedValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (validatedValue.length > 10) {
            validatedValue = validatedValue.slice(0, 10); // Limit to 10 numbers
        }
        setPhone(validatedValue);
    };

    const handleZipChange = (e) => {
        let validatedValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (validatedValue.length > 6) {
            validatedValue = validatedValue.slice(0, 6); // Limit to 6 numbers
        }
        setZip(validatedValue);
    };


    return (
        <div className=''>
            <h2 className='p-3 bg-primary text-xl font-bold text-center text-white'>Checkout</h2>
            <div className='p-5 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 py-8'>
                <div className='md:col-span-2 mx-20'>
                    <h2 className='font-bold text-3xl'>Billing Details</h2>
                    <div className='grid md:grid-cols-2 gap-10 mt-3'>
                        <Input placeholder='Name' type='text' maxLength='50'  
                        onKeyDown={(e) => {
                            if (/\d/.test(e.key)) {
                                e.preventDefault();
                            }
                        }} 
                        onChange={(e) => {
                            // Validate input to allow only characters
                            const re = /^[a-zA-Z\s]{0,50}$/;
                            if (e.target.value === '' || re.test(e.target.value)) {
                                setUserName(e.target.value);
                                }
                            }} />
                        <Input placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='grid grid-cols-2 gap-10 mt-3'>
                        <Input placeholder='Phone' type='text' value={phone} onChange={handlePhoneChange} />
                        <Input placeholder='Zip' type='text' value={zip} onChange={handleZipChange}/>
                    </div>
                    <div className='mt-3'>
                        <Input placeholder='Address' onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
                <div className='mx-10 border'>
                    <h2 className='p-3 bg-gray-200 font-bold text-center'>Total Cart ({totalCartItem})</h2>
                    <div className='p-4 flex flex-col gap-4'>
                        <h2 className='flex font-bold justify-between'>SubTotal : <span>${subTotal}</span></h2>
                        <hr></hr>
                        <h2 className='flex justify-between'>Delivery : <span>$10.00</span></h2>
                        <h2 className='flex justify-between'>Tax (9%): <span>${(totalCartItem * 0.9).toFixed(2)}</span></h2>
                        <hr></hr>
                        <h2 className='flex font-bold justify-between'>Total : <span>${calculateTotalAmount()}</span></h2>
                        <Button disabled={!(userName && email && address && zip)} onClick={() => onApprovePayment({ paymentId: 123 })}>Payment <ArrowBigRight /></Button>
                        {totalAmount > 15 && <PayPalButtons style={{ layout: "horizontal" }}
                            disabled={!(userName && email && address && zip)}
                            onClick={() => onApprovePayment({ paymentId: 123 })}
                            onApprove={onApprovePayment}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: totalAmount,
                                                currency_code: 'USD'
                                            },
                                        },
                                    ],
                                });
                            }}
                        />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
