import React from 'react'
import {auth} from "@/auth";


const Home = async () => {
    const session = await auth();
    console.log('Home rendered with session:', session)
    return (
        <>
            <h1 className="h1-bold">Welcome to the world of Next.js</h1>
        </>
    )
}
export default Home
