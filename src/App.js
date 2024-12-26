import Main from './pages/main/Main.js';
import AuthLogin from './pages/auth/AuthLogin.jsx';
import AuthRegister from './pages/auth/AuthRegister.jsx';
import Mypage from './pages/mypage/MyPage.jsx';
import {Route,Routes} from 'react-router-dom';
import { useState } from 'react';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Routes>
        <Route path='/' element={<Main isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Main>}></Route>
        <Route path='/login' element={<AuthLogin setIsLoggedIn={setIsLoggedIn}></AuthLogin>} ></Route>
        <Route path='/register' element={<AuthRegister></AuthRegister>}></Route>
        <Route path='/mypage' element={<Mypage></Mypage>}></Route>
      </Routes>
    </>
  );
}

export default App;
