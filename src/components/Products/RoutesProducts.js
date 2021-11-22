import React, { lazy }  from "react";
import { Route, Switch } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

const Products = lazy(() => import('./Products'));
const AddProduct = lazy(() => import('./AddProduct'));
const EditProduct = lazy(() => import('./EditProduct'));

const RoutesProducts = () => {
    const { user } = useAuth()

    return (
        <Switch>
			{user && productsRoutes.roles.includes(user.role) && <Route path="/products" exact component={Products} />}
			{user && productsRoutes.roles.includes(user.role) && <Route path="/product/add" exact component={AddProduct} />}
			{user && productsRoutes.roles.includes(user.role) && <Route path="/product/edit/:id" exact component={EditProduct} />}
		</Switch>
    )
}

export default RoutesProducts

export const productsRoutes = {
	name: 'Produits',
	to: '/products',
	exact: true,
	icon: 'home',
	roles: ["root", "admin"]
};