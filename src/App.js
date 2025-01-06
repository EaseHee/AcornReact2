import AuthLogin from './pages/auth/AuthLogin.jsx';
import AuthRegister from './pages/auth/AuthRegister.jsx';
import {Route,Routes} from 'react-router-dom';
import MainTemplate from "./pages/templates/main/MainTemplate";
import GTranslate from 'pages/templates/main/GTranslate.jsx';

function App() {

  return (
    <>
      <GTranslate />

      <Routes>
        <Route path='/*' element={<MainTemplate />}></Route>
        <Route path='/login' element={<AuthLogin />} ></Route>
        <Route path='/register' element={<AuthRegister></AuthRegister>}></Route>
      </Routes>
    </>
  );
}

export default App;
