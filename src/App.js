import React,{ Suspense } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import RouteList from './router'
function App() {
    return (
      <Suspense fallback={<div>Loading... </div>}>
      <Router>
        <Switch>
          <RouteList></RouteList>
        </Switch>
      </Router>
    </Suspense>
    )
}

export default App
