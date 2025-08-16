import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import Emailverify from './pages/Emailverify';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer/>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verify" element={<Emailverify />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App