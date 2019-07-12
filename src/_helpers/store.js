import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { history } from './history';
import rootReducer from '../_reducers';
import jwt from 'jsonwebtoken';

const loggerMiddleware = createLogger();
export const checkTokenExpirationMiddleware = store => next => action => {
    checkT(true, next, action);
};

export function checkT(middleWare, next, action) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const token = user.token;
        if (token) {
            const rToken = token.split(' ');
            if (jwt.decode(rToken[1], {complete: true}).payload.exp < Date.now() / 1000) {
                localStorage.clear();
                history.push('/login');
                if (middleWare) {
                    next(action);
                }
            }
            if (middleWare) {
                next(action);
            }
        }
    }
};

export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        checkTokenExpirationMiddleware,
        loggerMiddleware,
    )
);
