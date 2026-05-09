import MakePayment from '@/components/shopping/MakePayment'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Checkout Success",
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",
}

const Success = () => {
  return (
    <div>
        <MakePayment />
    </div>
  )
}

export default Success