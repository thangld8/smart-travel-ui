import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import { userConstants } from '../_constants';

export const userAction = {
    login,
    logout,
    register
};

function login(emailAddress, password) {
    console.log('UserAction login', emailAddress + password)
    return dispatch => {
        dispatch(request({ emailAddress }));
        userService.login(emailAddress, password)
            .then(user => {
                    if (!user.isLogin) {
                        dispatch(failure(user.message));
                        dispatch(alertActions.error(user.message));
                        alert(user.message)
                    } else {
                        dispatch(success(user));
                        history.push('/');
                    }
                    
                },
                error => {
                    alert(error)
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user}}
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user}}
    function failure(user) { return { type: userConstants.LOGIN_FAILURE, user}}
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    console.log('alert fail', error)
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}