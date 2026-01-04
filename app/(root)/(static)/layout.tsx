import { Footer } from "@/components/layout/footer";

export default function RootLayout( {
    children,
}:{
    children: React.ReactNode;
}) {
    return (
        <>
        <div className="min-h-screen"> 
            {children} 
            <Footer />
        </div>
        </>
    )
}