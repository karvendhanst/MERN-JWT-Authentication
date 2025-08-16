import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (

    <div className={`min-h-screen`}>
        <Navbar/>
        <div className='h-100 flex items-center justify-center'>
        <Header/>
        </div>
    </div>
    
  )
}

export default Home