import React, { useState, useEffect } from "react";
import { authService } from "../fbase";
import { Route, Routes, useLocation, Navigate} from "react-router-dom";
import Auth from "../routes/BF_login/Auth";
import Home from "../routes/AF_login/Home";
import Login from '../routes/BF_login/Logins/Login'
import Signup from "../routes/BF_login/Signups/Signup";
import Navigation from "../routes/Navigation";
import Profile from "../routes/AF_login/profile";
import Error_page from "../routes/Error_page";

function App() {
    const [userObj, setUserObj] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 회원가입 중
    const [signing, setSigning] = useState(false);

    // 모달 뒷배경
    const [modals, setModals] = useState(true);
    const location = useLocation();
    const background = location.state && location.state.background;

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: (args) => user.updateProfile(args),
                });
                console.log('logged in')
                setIsLoggedIn(true);
            } else {
                setUserObj(null);
            }
        });
    }, []);

    const refreshUser = () => {
        const user = authService.currentUser;
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
        });
    };

    return (
        <div>
                {(isLoggedIn && !signing) ?
                    (
                    <>
                        {(location.pathname === '/' || location.pathname === '/profile') && <Navigation userObj={userObj} setIsLoggedIn={setIsLoggedIn} />}
                        <Routes>
                        <Route path="/" element={<Home userObj={userObj} />} />
                        <Route
                            path="/profile"
                            element={<Profile userObj={userObj} refreshUser={refreshUser} />}
                        />
                        <Route path="/*" element={<Error_page/>} />
                        </Routes>
                    </>
                    ) :
                    (
                    <>
                    <Routes location={background || location}>
                        <Route path="/" element={<Auth setSigning={setSigning} setModals={setModals}/>} />
                        <Route path="/signup" element={<Signup signing={signing} setSigning={setSigning} modals={modals} setModals={setModals}/>} />
                        <Route path="/login" element={<Login modals={modals}/>} />
                        <Route path="/*" element={<Navigate to="/"/>} />
                    </Routes>
                    {background && (
                        <Routes>
                            <Route path="signup" element={<Signup signing={signing} setSigning={setSigning} modals={modals} setModals={setModals}/>} />
                            <Route path="/login" element={<Login modals={modals} />} />
                            <Route path="/*" element={<Navigate replace to="/"/>} />
                        </Routes>
                    )}
                    </>
                )}

        </div>
    );
}

export default App;