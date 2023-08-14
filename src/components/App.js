import React, { useState, useEffect } from "react";
import { authService } from "../fbase";
import { Route, Routes, useLocation, Navigate} from "react-router-dom";
import Auth from "../routes/BF_login/Auth";
import Home from "../routes/AF_login/Home";
import Login from '../routes/BF_login/Logins/Login'
import Signup from "../routes/BF_login/Signups/Signup";
import Navigation from "../routes/Navigation";
import Profile from "../routes/AF_login/Profiles/Profile";
import With_replies from "../routes/AF_login/Profiles/With_replies";
import Media from "../routes/AF_login/Profiles/Media";
import Likes from "../routes/AF_login/Profiles/Likes";
import Error_page from "../routes/Error_page";
import PW_reset from "../routes/BF_login/PW_resets/Pw_rest";
import Tweet from "../routes/AF_login/Tweet";
import Mention from "../routes/AF_login/Mention";

function App() {
    const [userObj, setUserObj] = useState({displayName: '', uid: '', photoURL: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 회원가입 중
    const [signing, setSigning] = useState(false);

    // 모달 뒷배경
    const [modals, setModals] = useState(true);
    const location = useLocation();
    const background = location.state && location.state.background;

    // navigation 표시 유무
    const [tweetPath, setTweetPath] = useState('');
    const navi_path = ['/', '/mention', '/:profile', '/compose/tweet', `/${userObj.uid}`, `${tweetPath}`, `/${userObj.uid}/media`, `/${userObj.uid}/likes`, `/${userObj.uid}/with_replies`];

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setUserObj({
                    // Auth에 담겨 있는 값
                    displayName: user.displayName,
                    uid: user.uid,
                    photoURL: user.photoURL,
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
            photoURL: user.photoURL,
            updateProfile: (args) => user.updateProfile(args),
        });
    };

    return (
        <div>
            {(isLoggedIn && !signing) ?
                (
                <>
                    {navi_path.indexOf(location.pathname) !== -1 && <Navigation userObj={userObj} setIsLoggedIn={setIsLoggedIn} />}
                    <Routes location={background || location}>
                        <Route path="/" element={<Home userObj={userObj} setTweetPath={setTweetPath}/>} />
                        <Route path="/:profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />}/>
                        <Route path="/:profile/with_replies" element={<With_replies userObj={userObj} refreshUser={refreshUser} />}/>
                        <Route path="/:profile/media" element={<Media userObj={userObj} refreshUser={refreshUser} />}/>
                        <Route path="/:profile/likes" element={<Likes userObj={userObj} refreshUser={refreshUser} />}/>
                        <Route path="/:profile/:tweetPath" element={<Mention userObj={userObj} refreshUser={refreshUser} />}/>
                        <Route path="/compose/tweet" element={<Tweet userObj={userObj} modals={true}/>} />
                        <Route path="/*" element={<Error_page/>} />
                    </Routes>
                    {background && (
                        <Routes>
                            <Route path="/" element={<Home userObj={userObj} />} />
                            <Route path="/:profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />}/>
                            <Route path="/:profile/with_replies" element={<With_replies userObj={userObj} refreshUser={refreshUser} />}/>
                            <Route path="/:profile/media" element={<Media userObj={userObj} refreshUser={refreshUser} />}/>
                            <Route path="/:profile/likes" element={<Likes userObj={userObj} refreshUser={refreshUser} />}/>
                            <Route path="/compose/tweet" element={<Tweet userObj={userObj} modals={true}/>} />
                            <Route path="/*" element={<Error_page/>} />
                        </Routes>
                    )}
                </>
                ) :
                (
                <>
                <Routes location={background || location}>
                    <Route path="/" element={<Auth setSigning={setSigning} setModals={setModals}/>} />
                    <Route path="/signup" element={<Signup signing={signing} setSigning={setSigning} modals={modals} setModals={setModals}/>} />
                    <Route path="/login" element={<Login modals={modals}/>} />
                    <Route path="/pwreset" element={<PW_reset modals={false} />}/>
                    <Route path="/*" element={<Navigate to="/"/>} />
                </Routes>
                {background && (
                    <Routes>
                        <Route path="signup" element={<Signup signing={signing} setSigning={setSigning} modals={modals} setModals={setModals}/>} />
                        <Route path="/login" element={<Login modals={modals} />} />
                        <Route path="/pwreset" element={<PW_reset modals={false} />}/>
                        <Route path="/*" element={<Navigate replace to="/"/>} />
                    </Routes>
                )}
                </>
            )}
        </div>
    );
}

export default App;