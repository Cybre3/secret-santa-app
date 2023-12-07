import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';
import api from './middleware/api';
import secure from './middleware/secure';

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
    return configureStore({
        reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(secure).concat(api)
    })
}