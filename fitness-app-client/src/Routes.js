import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import UploadGIF from "./containers/UploadGIF";
import Workout from "./containers/Workout";
import Status from "./containers/Status";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/gifs">
                <UploadGIF />
            </Route>
            <Route exact path="/workout/:clientId">
                <Workout />
            </Route>
            <Route exact path="/status">
                <Status />
            </Route>



            {/* Finally, catch all unmatched routes */}
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}