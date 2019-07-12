import { authHeader } from '../_helpers'
import config from '../_config/config.json'

export const userService = {
    login,
    logout,
    register
};

const env = process.env.baseUrl || 'dev';
const BaseApi = config.api;
const BaseUrl = config.api.dns[env];
const BasePublicApi = BaseApi.public;
const loginApi = BaseUrl+BasePublicApi.auth.login;
const registerApi = BaseUrl+BasePublicApi.auth.register;

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    }

    return fetch(loginApi, requestOptions).then(handleResponse)
            .then(user => {
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            });
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }
    return fetch(registerApi, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}