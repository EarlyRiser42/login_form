import AppRouter from "./AppRouter";
import React, { useState, useEffect } from "react";
import {authService} from "../fbase";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
      authService.onAuthStateChanged((user) => {
        if (user) {
          setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
          });
        }
        else {
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
        <>
          <AppRouter
              refreshUser={refreshUser}
              isLoggedIn={Boolean(userObj)}
              userObj={userObj}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
          />
        </>
    );
}
export default App;
