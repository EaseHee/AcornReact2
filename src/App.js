import Main from './pages/main/Main.js';
import AuthLogin from './pages/auth/AuthLogin.jsx';
import AuthRegister from './pages/auth/AuthRegister.jsx';
import Mypage from './pages/mypage/MyPage.jsx';
import {Route,Routes} from 'react-router-dom';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main></Main>}></Route>
        <Route path='/login' element={<AuthLogin></AuthLogin>}></Route>
        <Route path='/register' element={<AuthRegister></AuthRegister>}></Route>
        <Route path='/mypage' element={<Mypage></Mypage>}></Route>
      </Routes>
    </>
  );
}

export default App;
