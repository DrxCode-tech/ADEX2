import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Main from "./ADEX/ADEX";
import CreateAcctPOP from "./ADEX/CreateAcct";
import ADEXLogin from "./ADEX/ADEXlogin";
import CreateAccount from "./ADEX/ADEXsign";
import LinkNX from "./ADEX/LinkNX";
import NXDEX from "./ADEX/NXDEX";
import ADEX_I from "./ADEX/ADEX_I";

export default function App(){
  return (
    <Router>
      <main className="w-full bg-black">
        <Routes >
          <Route path='/create' element={<CreateAcctPOP />} />
          <Route path='/' element={<Main />}/>
          <Route path='/login' element={<ADEXLogin />} />
          <Route path='/signup' element={<CreateAccount />} />
          <Route path='/linknx' element={<LinkNX />} />
          <Route path="/nxdex" element={<NXDEX />} />
          <Route path="/ai" element={<ADEX_I />} />
        </Routes>
      </main>
    </Router>
  )
}