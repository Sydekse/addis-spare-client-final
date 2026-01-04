import React, { useEffect, useState } from "react";
import ProductCard from "../products/product-card";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/api/services/product.service";
import { Button } from "../ui/button";

const HomeProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            setProducts(products.slice(0, 10)); 
        };
        fetchProducts();
    }, [products]);

    return (
        <div className="flex flex-col items-center pt-14">
                <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Popular <span className="text-orange-600">Products</span></p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>
            {/* <p className="text-2xl font-medium text-left w-full">Popular products</p> */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
                {products.map((product, index) => <ProductCard key={index} product={product} />)}
            </div>
            <Button onClick={() => { router.push('/products') }} className="px-12 py-4 border rounded-2xl hover:bg-primary/60 transition">
                See more
            </Button>
        </div>
    );
};

export default HomeProducts;
