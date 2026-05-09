import FavoritesCard from '@/components/shopping/FavoriteCard'
import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Favorites",
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",
}

const Favorites = () => {
  return (
    <div>
      <FavoritesCard />
    </div>
  )
}

export default Favorites