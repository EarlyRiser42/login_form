import React, { useState, useEffect } from "react";
import { authService } from "../fbase";
import { Route, Routes, useLocation, Navigate} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Signup from "../Signup_components/Signup";
import Navigation from "./Navigation";
import Profile from "../routes/profile";
import Error_page from "../routes/Error_page";

function App() {
    const [userObj, setUserObj] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 회원가입 중
    const [signing, setSigning] = useState(false);

    // 모달 뒷배경
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
            {(isLoggedIn && !signing)  && <Navigation userObj={userObj} setIsLoggedIn={setIsLoggedIn} />}
                {(isLoggedIn && !signing) ?
                    (
                    <>
                        <Routes >
                        <Route path="/" element={<Home userObj={userObj} />} />
                        <Route
                            path="/profile"
                            element={<Profile userObj={userObj} refreshUser={refreshUser} />}
                        />
                        <Route path="/signup" element={<Navigate replace to="/error"/>} />
                        <Route path="/error" element={<Error_page />} />
                        </Routes>
                    </>
                    ) :
                    (
                    <>
                    <Routes location={background || location}>
                        <Route path="/" element={<Auth setSigning={setSigning}/>}>
                            <Route path="/signup" element={<Signup signing={signing} setSigning={setSigning}/>} />
                        </Route>
                    </Routes>
                    {background && (
                        <Routes>
                            <Route path="signup" element={<Signup signing={signing} setSigning={setSigning}/>} />
                        </Routes>
                    )}
                    </>
                )}

        </div>
    );
}

export default App;