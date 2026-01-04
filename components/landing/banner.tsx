
import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Banner = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between md:pl-14 sm:py-14 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
            <Image
                width={200}
                height={200}
                className="max-w-56 hidden md:block"
                src={'https://static.vecteezy.com/system/resources/previews/013/362/883/non_2x/black-rubber-car-tires-transparent-free-png.png'}
                alt="jbl_soundbox_image"
            />
            <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
                <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
                    Level Up Your Shopping Experience
                </h2>
                <p className="max-w-[343px] font-medium text-gray-800/60">
                    The best tools and spare parts you need for a safe drive.
                </p>
                <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white">
                    Buy now
                    <ArrowRight className="group-hover:translate-x-1 transition" />
                </button>
            </div>
            <Image
                width={200}
                height={200}
                className="hidden md:block max-w-80"
                src={'https://www.pngall.com/wp-content/uploads/4/Automotive-Battery-PNG-Free-Download.png'}
                alt="md_controller_image"
            />
            <Image
                width={200}
                height={200}
                className="hidden"
                src={'https://www.pngall.com/wp-content/uploads/4/Automotive-Battery-PNG-Free-Download.png'}
                alt="sm_controller_image"
            />
        </div>
    );
};

export default Banner;