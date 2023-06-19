import React from "react";
import TeamDivision from "../pages/TeamDivision";
import GuessMovie from "../pages/GuessMovie";
import ChooseActor from "../pages/ChooseActor";
import ChooseMovie from "../pages/ChooseMovie";
import Home from "../pages/Home";
import {BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom';


function App() {
  
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/:roomid' exact component={TeamDivision} />
        <Route path='/:roomid/choose-movie' exact component={ChooseMovie} />
        <Route path='/:roomid/choose-actor' exact component={ChooseActor} />
        <Route path='/:roomid/guess-movie' exact component={GuessMovie} />
      </Switch>
    </Router>  
  );
}

export default App;
