import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from './api';
import _ from 'lodash';

const slice = createSlice({
    name: 'groups',
    initialState: {
        list: [],
        loading: false,
    },
    reducers: {
        groupsRequested: (groups, action) => {
            groups.loading = true;
        },

        groupsRequestFailed: (groups, action) => {
            groups.loading = false;
        },

        groupsReceived: (groups, action) => {
            groups.list = action.payload
            groups.loading = false;
            // users.lastFetch = Date.now();
        },

        groupAdded: (groups, action) => {
            groups.list.push(action.payload);
            groups.loading = false;
        },

        userAddedToGroup: (groups, action) => {
            const { user } = action.payload;
            const groupIndex = groups.list.findIndex(group => group.name === user.group);
            const group = groups.list[groupIndex];

            group.users.push(user);
        },

        personRemovedFromPickPool: (groups, action) => {
            const { groupname, personToGift } = action.payload;
            const groupIndex = groups.list.findIndex(group => group.name === groupname);
            const group = groups.list[groupIndex];

            group.pickPool.filter(person => person.email !== personToGift.email)
        },

        personAssignedToUser: (groups, action) => {
            const { personToGift, user } = action.payload;
            const groupIndex = groups.list.findIndex(group => group.name === user.currentGroup);
            const group = groups.list[groupIndex];
            const santaIndex = group.secretSantas.findIndex(santa => santa.email === user.email);

            group.secretSantas[santaIndex].personToGift = personToGift;
        }
    }
});

// Action Creators
const { groupsRequested, groupsRequestFailed, groupsReceived, groupAdded, userAddedToGroup, personRemovedFromPickPool, personAssignedToUser } = slice.actions;
export default slice.reducer;

const url = '/groups';

export const loadGroups = () =>
    apiCallBegan({
        url,
        onStart: groupsRequested.type,
        onSuccess: groupsReceived.type,
        onError: groupsRequestFailed.type
    })

export const addGroup = group =>
    apiCallBegan({
        url,
        method: 'post',
        data: group,
        onSuccess: groupAdded.type
    })

export const addUserToGroup = (user) =>
    apiCallBegan({
        url: `${url}/${user.group}`,
        method: 'patch',
        data: _.omit(user, 'repassword'),
        onSuccess: userAddedToGroup.type
    })

export const removePersonFromPickPool = (personToGift, groupname) =>
    apiCallBegan({
        url,
        method: 'patch',
        data: { personToGift, groupname },
        onSuccess: personRemovedFromPickPool.type
    })

export const assignPersonToUser = (user, personToGift) =>
    apiCallBegan({
        url: `${url}/${user.currentGroup}/${user._id}`,
        method: 'patch',
        data: { user, personToGift },
        onSuccess: personAssignedToUser.type
    })

// Selectors
export const getPersonData = person => createSelector(
    state => state.entities.groups,
    groups => groups.list.filter(group => {
        return group.filter(user => user._id === person._id)
    })
)

export const getGroup = groupname => createSelector(
    state => state.entities.groups,
    groups => groups.list.filter(group => group.name === groupname)
)


// groups
// group
// id: string
// name: string
// users: []
// secretSantas: []
// spectators: []
// pickPool: []