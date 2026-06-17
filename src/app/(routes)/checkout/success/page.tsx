import React from 'react'
import { Metadata } from 'next'
import SuccessPayment from '@/components/shopping/SuccessPayment'

export const metadata: Metadata = {
  title: "Checkout Success",
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",
}

const Success = () => {
  return (
    <div>
        <SuccessPayment />
    </div>
  )
}

export default Success