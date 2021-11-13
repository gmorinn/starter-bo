import React, { lazy, useEffect } from "react";
import { Container } from '@mui/material';
import { Switch, Route, Redirect } from "react-router-dom";
import './App.scss'
import Header from "./components/Header";
import { useAuth } from "./Hooks/useAuth";
import { useApi } from "./Hooks/useApi";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "./store/user";
import NotFound from "./screen/notFound";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = lazy(() => import("./screen/homepage"))
const Sign = lazy(() => import("./screen/sign"))

toast.configure();

const App = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)
  const { user } = useAuth()
  const { Fetch } = useApi()

  useEffect(() => {
    user && user.id ? Fetch(`/v1/web/user/${user.id}`).then(res => {
        if (res?.success && res.user) {
          setCurrentUser(res.user)
        } else {
          setCurrentUser(null)
        }
    }) : setCurrentUser(null)
    // eslint-disable-next-line
  }, [user])

  return (
    <>
      <Container className="mt-5" maxWidth="xl">
          <Header />
          <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/sign" render={() => currentUser ? <Redirect to='/' /> : <Sign />} />
                <Route component={NotFound} />
          </Switch>
        </Container>
    </> 
  )
}

// // eslint-disable-next-line 
const PrivateRoute = ({ component: Component, ...rest }) => {
	const auth = useAuth()
	const user = auth.loggedIn() && auth.user

	return (<Route
		{...rest}
		render={props =>
			user ? <Component {...props} /> : <Redirect to={{ pathname: "/sign", search: `?next=${props.location.pathname}` }} />
		}
	/>)
};

export default App;