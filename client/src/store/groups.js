import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from './api';

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

            group.push(user);
        },

        personFromPickPoolRemoved: (groups, action) => {
            const { personToGift } = action.payload;
            const groupIndex = groups.list.findIndex(group => group.name === personToGift.group);
            const group = groups.list[groupIndex];

            group.pickPool.filter(person => person._id !== personToGift._id)
        }
    }
});

// Action Creators
const { groupsRequested, groupsRequestFailed, groupsReceived, groupAdded, userAddedToGroup, personFromPickPoolRemoved } = slice.actions;
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

export const addUserToGroup = user =>
    apiCallBegan({
        url: `${url}/${user.groupname}`,
        method: 'post',
        data: user,
        onSuccess: userAddedToGroup.type
    })

export const removePersonFromPickPool = personToGift =>
    apiCallBegan({
        url: `${url}/${personToGift.group}/${personToGift._id}`,
        method: 'delete',
        data: personToGift,
        onSuccess: personFromPickPoolRemoved.type
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