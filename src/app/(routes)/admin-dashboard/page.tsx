import Dashboard from '@/components/admin/Dashboard'
import CreatePenForm from '@/components/admin/CreatePenForm'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",
}

const AdminDashboard = () => {
  return (
    <div>
        <Dashboard />
    </div>
  )
}

export default AdminDashboard