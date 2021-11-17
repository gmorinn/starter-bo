import React, { lazy } from "react";
import { Route } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/Header";

const RoutesUsers = lazy(() => import('../components/Users/RoutesUsers'));
const RoutesProducts = lazy(() => import('../components/Products/RoutesProducts'));
const Users = lazy(() => import('../components/Users/Users'));

const Homepage = () => {
  return (
    <>
        <Header />
        <Route path="/" exact component={Users} />
        <RoutesUsers />
        <RoutesProducts />
        <Footer />
    </>
  )
}

export default Homepage