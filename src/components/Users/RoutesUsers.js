import React, { lazy }  from "react";
import { Route, Switch } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

const Users = lazy(() => import('./Users'));
const AddUser = lazy(() => import('./AddUser'));
const EditUser = lazy(() => import('./EditUser'));

const RoutesUsers = () => {
    const { user } = useAuth()

    return (
        <Switch>
			{user && usersRoutes.roles.includes(user.role) && <Route path="/users" exact component={Users} />}
			{user && usersRoutes.roles.includes(user.role) && <Route path="/user/add" exact component={AddUser} />}
			{user && usersRoutes.roles.includes(user.role) && <Route path="/user/edit/:id" exact component={EditUser} />}
		</Switch>
    )
}

export default RoutesUsers

export const usersRoutes = {
	name: 'Utilisateurs',
	to: '/users',
	exact: true,
	icon: 'home',
	roles: ["root", "admin", "user"]
};