import { combineReducers } from "redux";

import usersReducer from './users';
import groupsReducer from './groups';

export default combineReducers({
    users: usersReducer,
    groups: groupsReducer
})