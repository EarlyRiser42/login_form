import React, { useState, useEffect } from "react";
import { authService } from "../fbase";
import { Route, Routes, useLocation} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Signup from "../Signup_components/Signup";
import Navigation from "./Navigation";
import Profile from "../routes/profile";

function App({ isLoggedIn }) {
    const [userObj, setUserObj] = useState(null);

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
            {isLoggedIn && <Navigation userObj={userObj} />}
                {isLoggedIn ?
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
                        <Route path="/" element={<Auth />}>
                            <Route path="/signup" element={<Signup />} />
                        </Route>
                    </Routes>
                    {background && (
                        <Routes>
                            <Route path="signup" element={<Signup />} />
                        </Routes>
                    )}
                    </>
                )}

        </div>
    );
}

export default App;