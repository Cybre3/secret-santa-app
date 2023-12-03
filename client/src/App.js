import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import Login from './components/Login';
import Register from './components/Register';
import SecretSanta from './components/secretSanta/SecretSanta';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<Navigate replace to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/secret-santa/:id' element={<SecretSanta />} />
      </Routes>
    </Provider>
  )
}

export default App;

