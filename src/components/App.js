import AppRouter from "./AppRouter";
import React, { useState, useEffect } from "react";
import {authService} from "../fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      console.log(user);
      console.log(isLoggedIn)
    });

  }, []);
  return (
      <>
        <AppRouter isLoggedIn={isLoggedIn} />
      </>
  );
}
export default App;
