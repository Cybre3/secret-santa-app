import { createSelector, createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';

import { apiCallBegan } from './api';

const slice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        loggedIn: [],
        loading: false,
        emailVerified: false
    },
    reducers: {
        usersRequested: (users, action) => {
            users.loading = true;
        },

        usersRequestFailed: (users, action) => {
            users.loading = false;
        },

        usersReceived: (users, action) => {
            users.list = action.payload
            users.loading = false;
            // users.lastFetch = Date.now();
        },

        userEmailChecked: (users, action) => {
            users.emailVerified = true;
        },

        userLogggedIn: (users, action) => {
            const { _id, email, token } = action.payload;

            localStorage.setItem('token', token);
            users.loggedIn.push({ _id, email });

            users.loading = false;
        },

        userRegistered: (users, action) => {
            users.list.push(action.payload)
            users.loading = false;
        },

        giftAddedToUser: (users, action) => {
            const { gift, userId } = action.payload;
            const userIndex = users.list.findIndex(user => user._id === userId);
            const user = users.list[userIndex];

            user.giftList.push(gift);

            // look into optimizing implentation and use logged in users instead.
        }
    }
})

// Action Creators
const { userEmailChecked, userLogggedIn, userRegistered, usersRequested, usersRequestFailed, usersReceived, giftAddedToUser } = slice.actions;
export default slice.reducer;

const url = '/users';

export const checkUserEmail = email =>
    apiCallBegan({
        url: `/auth/${email}`,
        onSuccess: userEmailChecked.type
    })

export const loginUser = user =>
    apiCallBegan({
        url: '/auth',
        method: 'post',
        data: user,
        onSuccess: userLogggedIn.type
    })


export const registerUser = user =>
    apiCallBegan({
        url,
        method: 'post',
        data: _.omit(user, 'repassword'),
        onSuccess: userRegistered.type
    });


export const loadUsers = () => (dispatch, getState) => {
    // const { lastFetch } = getState().entities.cars;

    // const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');

    // if (diffInMinutes < 2) return;


    return dispatch(
        apiCallBegan({
            url,
            onStart: usersRequested.type,
            onSuccess: usersReceived.type,
            onError: usersRequestFailed.type
        }));

}

export const addGiftToUser = (userId, gift, groupname) =>
    apiCallBegan({
        url: `${url}/secret-santa/${userId}`,
        method: 'patch',
        data: { userId, gift },
        onSuccess: giftAddedToUser.type
    })


// Selectors

export const getCurrentUser = userId => createSelector(
    state => state.entities.users,
    users => users.list.filter(user => user._id === userId)
)

export const getCurrentUserByEmail = userEmail => createSelector(
    state => state.entities.users,
    users => users.list.filter(user => user.email === userEmail)
)
