import './App.css';
import Dashboard from './Modules/Dashboard/dashboard';
import Form from './Modules/Form';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children , auth = false}) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;

  if(!isLoggedIn && auth) {
    return <Navigate to={'/users/sign_up'}></Navigate>
  }

  else if(isLoggedIn &&  ['/users/sign_in' , '/users/sign_up'].includes(window.location.pathname)) {
    return <Navigate to={'/'}></Navigate>
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute auth = {true}>
          <Dashboard/>
        </ProtectedRoute>
      }></Route>
      <Route path='/users/sign_in' element={ 
        <ProtectedRoute>
          <Form isSignInPage={true}/>
        </ProtectedRoute>
       }></Route>
      <Route path='/users/sign_up' element={
        <ProtectedRoute>
          <Form isSignInPage={false}/>
        </ProtectedRoute>
      }></Route>
    </Routes>
  );
}

export default App;
