import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import Login from './components/Login';
import Register from './components/Register';
import SecretSanta from './components/secretSanta/SecretSanta';
import { getCurrentUser } from './services/authService';

const store = configureStore();

function App() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<Navigate replace to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/secret-santa/:id' element={<SecretSanta />} />
      </Routes>
      {
        user &&
        <button onClick={() => handleLogout()} className='absolute top-3 right-6 bg-white rounded p-2 py-1 tracking-wide border border-black hover:bg-neutral-300'>Logout</button>
      }
    </Provider>
  )
}

export default App;

