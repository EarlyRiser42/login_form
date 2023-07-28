import React, { useState, useEffect } from "react";
import { authService } from "../fbase";
import { Route, Routes, useLocation} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Signup from "../Signup_components/Signup";
import Navigation from "./Navigation";
import Profile from "../routes/profile";

function App() {
    const [userObj, setUserObj] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // signup ~새로고침/새로고침
    const [signing, setSigning] = useState(false);
    const [firsttime, setFirsttime] = useState(false);

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
            {(isLoggedIn && !signing) && <Navigation userObj={userObj} setIsLoggedIn={setIsLoggedIn} />}
                {(isLoggedIn && !signing) ?
                    (
                    <>
                        <Routes >
                        <Route path="/" element={<Home userObj={userObj} />} />
                        <Route
                            path="/profile"
                            element={<Profile userObj={userObj} refreshUser={refreshUser} />}
                        />
                        </Routes>
                    </>
                    ) :
                    (
                    <>
                    <Routes location={background || location}>
                        <Route path="/" element={<Auth setSigning={setSigning} setFirsttime={setFirsttime} />}>
                            <Route path="/signup" element={<Signup firsttime={firsttime}/>} />
                        </Route>
                    </Routes>
                    {background && (
                        <Routes>
                            <Route path="signup" element={<Signup firsttime={firsttime}/>} />
                        </Routes>
                    )}
                    </>
                )}

        </div>
    );
}

export default App;