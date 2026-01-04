'use client'
import Banner from '@/components/landing/banner';
import FeaturedProduct from '@/components/landing/featured-products';
import HeaderSlider from '@/components/landing/header-slider';
import HomeProducts from '@/components/landing/home-products';
import {Footer} from '@/components/layout/footer';
import React from 'react';

const Home = () => {
  return (
    <>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
      </div>
      <Footer />
    </>
  );
};

export default Home;
