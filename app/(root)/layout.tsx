import React from 'react'
import NavBar from "@/components/navigation/navbar";


export default function RootLayout({
                                      children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
       <main>
           <NavBar />
           {children}
       </main>
    );
}