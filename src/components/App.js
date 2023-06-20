import AppRouter from "./AppRouter";
import React, { useState, useEffect } from "react";
import {authService} from "../fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      console.log(user);
      console.log(isLoggedIn)
    });

  }, []);
  return (
      <>
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/>
      </>
  );
}
export default App;
