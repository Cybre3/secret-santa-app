import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from './api';

const slice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        loggedIn: [],
        loading: false,
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

        },

        userLogggedIn: (users, action) => {
            users.loggedIn.push(action.payload);
            users.loading = false;
        },

        userRegistered: (users, action) => {
            users.list.push(action.payload)
            users.loading = false;
        },

        giftAddedToUser: (users, action) => {
            const { gifts, userId } = action.payload;
            const userIndex = users.list.findIndex(user => user._id === userId);
            const user = users.list[userIndex];

            user.gifts.push(gifts);

            // look into optimizing implentation and use logged in users instead.
        }
    }
})

// Action Creators
const { userEmailChecked, userLogggedIn, userRegistered, usersRequested, usersRequestFailed, usersReceived, giftAddedToUser } = slice.actions;
export default slice.reducer;

const url = '/users';

export const checkUserEmail = user =>
    apiCallBegan({
        url,
        method: 'post',
        data: user,
        onSuccess: userEmailChecked.type
    })

export const loginUser = user =>
    apiCallBegan({
        url,
        method: 'post',
        data: user,
        onSuccess: userLogggedIn.type
    })


export const registerUser = user =>
    apiCallBegan({
        url,
        method: 'post',
        data: user,
        onSucess: userRegistered.type
    })

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

export const addGiftToUser = (userId, gift) =>
    apiCallBegan({
        url: `${url}/secret-santa/${userId}`,
        method: 'post',
        data: { userId, gift },
        onSuccess: giftAddedToUser.type
    })

export const assignPersonToUser = (userId, personId) =>
    apiCallBegan({

    })


// Selectors

export const getCurrentUser = userId => createSelector(
    state => state.entities.users,
    users => users.list.filter(user => user._id === userId)
)
