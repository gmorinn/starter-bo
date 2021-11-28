import { FormControlLabel, Switch } from "@mui/material";
import React, { lazy } from "react";
import { Route } from 'react-router-dom';
import { useRecoilState } from "recoil";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { darkModeAtom } from "../store/mode";

const RoutesUsers = lazy(() => import('../components/Users/RoutesUsers'));
const RoutesProducts = lazy(() => import('../components/Products/RoutesProducts'));
const Users = lazy(() => import('../components/Users/Users'));

const Homepage = () => {
  const [mode, setMode] = useRecoilState(darkModeAtom)
  return (
    <>
        <Header />
        <FormControlLabel onChange={() => setMode(v => !v)} control={<Switch value={mode} />} label="Dark" className="p-3" />
        <Route path="/" exact component={Users} />
        <RoutesUsers />
        <RoutesProducts />
        <Footer />
    </>
  )
}

export default Homepage