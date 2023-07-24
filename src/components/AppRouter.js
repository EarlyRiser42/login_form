import React, {useState} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Signup from "../Signup_components/Signup";
import Navigation from "./Navigation";
import Profile from "../routes/profile";

const AppRouter = ( {refreshUser, isLoggedIn, userObj, isModalOpen, setIsModalOpen} ) => {
    return(
        <div>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {
                    isLoggedIn ?
                    // fragment for render many components without div or parents component
                    <>
                        <Route path='/' element={<Home userObj={userObj} />}/>
                        <Route path='/' element={<Profile userObj={userObj}  refreshUser={refreshUser}/>}/>
                    </>
                :
                        <>
                            <Route path='/' element={<Auth setIsModalOpen={setIsModalOpen}/>}/>
                            <Route path='/signup' element={<Signup isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>}/>
                        </>
                }
                </Routes>
        </div>
    )
}

export default AppRouter