import React, {useState} from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = ( {login} ) => {
    return(
        <Router>
            <Switch>
                {
                    login ?
                    // fragment for render many components without div or parents component
                    <>
                        <Route exact path='/'>
                            <Home/>
                        </Route>
                    </>
                :
                    <Route exact path='/'>
                        <Auth/>
                    </Route>
                }
            </Switch>
        </Router>
    )
}

export default AppRouter