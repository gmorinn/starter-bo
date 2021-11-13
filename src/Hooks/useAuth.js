import React, { useState, useEffect, useContext, createContext } from "react";
import jwt_decode from "jwt-decode";
const authContext = createContext();

const api = process.env.REACT_APP_API_URL

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
	return useContext(authContext);
};

const setAccessToken = token => token && localStorage.setItem('accessToken', token)

const setRefreshToken = token => token && localStorage.setItem('refreshToken', token)

const setOAuthToken = oAuth => sessionStorage.setItem('oAuth', oAuth)

const getAccessToken = () => localStorage.getItem('accessToken')

const getRefreshToken = () => localStorage.getItem('refreshToken')

const getOAuthToken = () => sessionStorage.getItem('oAuth')

const getUser = jwt => {
	let token = jwt || getAccessToken()
	let user = token ? jwt_decode(token) : null
	return user;
};

const isTokenExpired = token => {
	try {
		const decoded = jwt_decode(token);
		if (decoded.exp < Date.now() / 1000) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		localStorage.removeItem("refreshToken")
		sessionStorage.removeItem("accessToken")
		return false;
	}
};

const loggedIn = () => {
	const token = getAccessToken();
	if (!!token && !isTokenExpired(token)) {
		return true
	}
	return false
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
	const [user, setUser] = useState(null);
	const [load, setLoad] = useState(false);

	const [oAuth, setOAuth] = useState(null)

	const getAuthorization = async () => {
		setLoad(true);

		const response = await fetch(`${api}/authorization`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: 'POST',
			body: JSON.stringify({
				grant_type: "client_credentials",
				client_id: process.env.REACT_APP_CLIENT_ID,
				client_secret: process.env.REACT_APP_CLIENT_SECRET
			})
		});

		const body = await response.json();
		setOAuth(body.access_token);
		setOAuthToken(body.access_token);
		setLoad(false);
		return body.access_token;
	}

	useEffect(() => {
		!oAuth && getAuthorization()
		return () => {
			getOAuthToken()
		}
	}, [oAuth])

	const refreshToken = async refresh_token => {
		const r_token = refresh_token || getRefreshToken()

		if (!r_token) {
			return logout()
		}

		setLoad(true)
		return await fetch(`${api}/refresh`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				refresh_token: getRefreshToken()
			})
		}).then(async resp => {
			if (resp.status === 403) {
				return await getAuthorization().then(async () => await refreshToken(refresh_token))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
	};

	const login = async (email, password) => {
		setLoad(true)
		return await fetch(`${api}/signin`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				email: email,
				password: password
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await login(email, password))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
		.catch(err => {
			console.error(err)
			return err
		})
	};

	const signWithProvider = async (payload) => {
		setLoad(true)
		return await fetch(`${api}/sign-providers`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				...payload
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await signWithProvider(payload))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
	};


	const signup = async (reqBody) => {
		setLoad(true)
		let res = await fetch(`${api}/signup`, {
			headers: {
				Authorization: `Bearer ${getOAuthToken()}`,
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify({
				...reqBody
			})
		})
		if (res.status === 403) {
			return await getAuthorization().then(res => res && signup(reqBody))
		}
		setLoad(false)
		return await res.json().then((resp) => {
			setAccessToken(resp.access_token);
			setRefreshToken(resp.refresh_token);
			setUser(getUser(resp.access_token));
			return resp
		})
		.catch(err => {
			console.error(err)
			return err
		})
	}

	const logout = () => {
		localStorage.removeItem("refreshToken")
		localStorage.removeItem("accessToken")
		setUser(() => null)
	};

	const lost = async email => {
		setLoad(true)
		return await fetch(`${api}/v1/web/lost`, {
			headers: {
				"Authorization": `Bearer ${getOAuthToken()}`,
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify({
				email: email
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await lost(email))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			return body
		})
	};

	const newPassword = async (password, confirm, token) => {
		setLoad(true)
		return await fetch(`${api}/v1/web/password/${token}`, {
			headers: {
				"Authorization": `Bearer ${getOAuthToken()}`,
				"Content-Type": "application/json"
			},
			method: "PATCH",
			body: JSON.stringify({
				password: password,
				confirm: confirm
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await newPassword(password, token))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			return body
		})
	};

	const getProfile = async (params) => {
		let res = await fetch(`${api}/v1/web/profile/${params.id}`, {
			headers: {
				Authorization: `Bearer ${getOAuthToken()}`,
				jwtToken: `Bearer ${getAccessToken()}`,
			},
			method: "GET"
		});

		if (res.status === 403) {
			return await getAuthorization().then(res => res && getProfile(params))
		}
		return res.json()
	}

	useEffect(() => {
		if (loggedIn()) {
			setUser(getUser())
		} else {
			refreshToken()
		}
		// eslint-disable-next-line
	}, []);

	// Return the user object and auth methods
	return {
		getAuthorization,
		getOAuthToken,
		getAccessToken,
		loggedIn,
		refreshToken,
		signWithProvider,
		load,
		user,
		signup,
		login,
		logout,
		lost,
		newPassword,
		getProfile,
	};
}