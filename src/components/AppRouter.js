import React, {useState} from "react";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Signup from "../routes/Signup";
import Navigation from "./Navigation";

const AppRouter = ( {isLoggedIn, userObj} ) => {
    return(
        <Router>
            {isLoggedIn && <Navigation />}
            <Routes>
                {
                    isLoggedIn ?
                    // fragment for render many components without div or parents component
                    <>
                        <Route path='/' element={<Home userObj={userObj} />}/>
                    </>
                :
                        <>
                            <Route path='/' element={<Auth/>}/>
                            <Route path='/signup' element={<Signup/>}/>
                        </>
                }
                </Routes>
        </Router>
    )
}

export default AppRouter