import Hero from '@/components/community/Hero'
import YourPeople from '@/components/community/yourPeople'
import TrustedBy from '@/components/community/trustedBy'
import Reviews from '@/components/community/reviews'
import Gallery from '@/components/community/gallery'
import React from 'react'
import BigDeal from '@/components/community/bigDeal'

const page = () => {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <YourPeople />
      <TrustedBy />
      <Reviews />
      <Gallery />
      <BigDeal/>
    </div>
  )
}

export default page