import Hero from '@/components/community/Hero'
import YourPeople from '@/components/community/yourPeople'
import TrustedBy from '@/components/community/trustedBy'
import Reviews from '@/components/community/reviews'
import Gallery from '@/components/community/gallery'
import React from 'react'
import BigDeal from '@/components/community/bigDeal'

const page = () => {
  return (
    <div className="relative w-full flex flex-col">
      <Hero />
      <YourPeople />
      <TrustedBy />
      <Reviews />
      <Gallery />
      <BigDeal/>
      <div className="h-16 w-full bg-[#f2f1f0] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </div>
  )
}

export default page