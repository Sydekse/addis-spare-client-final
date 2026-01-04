import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    image: "https://vparts.se/media/catalog/product/2/4/24110401-001.jpg",
    title: "Spark Plugs",
    description: "High-performance spark plugs designed for optimal ignition and engine efficiency.",
  },
  {
    id: 2,
    image: "https://www.treadwright.com/cdn/shop/products/1_004d31fa-08a1-4cfc-a81c-12d9879f61f3.jpg?v=1602632789",
    title: "Car Tires",
    description: "Durable and reliable car tires that provide excellent grip, safety, and long-lasting performance.",

  },
  {
    id: 3,
    image: 'https://image.made-in-china.com/318f0j00YQrGswoKaLbE/xOV7FLTWxpRPEpXBsHR-303958349755-mp4-264-hd-mp4.webp',
    title: "Air Filter",
    description: "Premium air filters that ensure clean airflow to your engine, improving fuel efficiency and engine life.",

  },
];

const FeaturedProduct = () => {
  const router = useRouter();
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              height={400}
              width={400}
              className="group-hover:brightness-50 brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60 ">
                {description}
              </p>
              <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded" onClick={() => router.push('/products')}>
                Buy now <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
