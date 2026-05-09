import ShopProduct from '@/components/shopping/ShopProduct'
import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",
}

const Checkout = () => {
  return (
    <div>
        <ShopProduct />
    </div>
  )
}

export default Checkout