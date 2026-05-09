import CartItems from '@/components/shopping/CartItems'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",
}

const Cart = () => {
  return (
    <div>
      <CartItems />
    </div>
  )
}

export default Cart