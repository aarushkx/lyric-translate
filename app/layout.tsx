import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/utils/constants";
import { Footer, Navbar } from "./_components/index";

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: APP_NAME,
    description: APP_DESCRIPTION,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // <html lang="en">
        //     <body className={`${poppins.className} antialiased`}>
        //         <Navbar />
        //         {children}
        //         <Footer />
        //     </body>
        // </html>
        <html lang="en">
            <body
                className={`${poppins.className} antialiased flex flex-col min-h-full`}
            >
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
