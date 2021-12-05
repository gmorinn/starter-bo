import React, { lazy, useEffect, useMemo } from "react";
import { Container } from '@mui/material';
import { Switch, Route, Redirect } from "react-router-dom";
import './App.scss'
import { useAuth } from "./Hooks/useAuth";
import { useApi } from "./Hooks/useApi";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentUserAtom } from "./store/user";
// import NotFound from "./screen/notFound";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkModeAtom } from "./store/mode";

const Home = lazy(() => import("./screen/homepage"))
const Sign = lazy(() => import("./screen/sign"))
const CheckEmail = lazy(() => import("./screen/checkEmail"))
const ForgotPassword = lazy(() => import("./screen/forgotPassword"))

toast.configure();

const App = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)
  const { user, logout } = useAuth()
  const { Fetch } = useApi()
  const darkMode = useRecoilValue(darkModeAtom)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode],
  );


  useEffect(() => {
    user && user.id ? Fetch(`/v1/bo/user/${user.id}`).then(res => {
        if (res?.success && res.user) {
          setCurrentUser(res.user)
        } else {
          setCurrentUser(null)
          logout()
        }
    }) : setCurrentUser(null)
    return () => setCurrentUser(null)
    // eslint-disable-next-line
  }, [user])

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container className="mt-5" maxWidth="xl">
            <Switch>
                <Route exac path="/sign" render={() => currentUser ? <Redirect to='/' /> : <Sign />} />
                <Route exac path="/forgot-password" component={ForgotPassword} />
                <Route exac path="/check-email" component={CheckEmail} />
                <PrivateRoute exac path="/" component={Home} />
            </Switch>
        </Container>
    </ThemeProvider>
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