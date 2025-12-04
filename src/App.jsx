import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Main from "./ADEX/ADEX";
import CreateAcct from "./ADEX/CreateAcct";
import ADEXLogin from "./ADEX/ADEXlogin";

export default function App(){
  return (
    <Router>
      <main className="w-full">
        <Routes >
          <Route path='/create' element={<CreateAcct />} />
          <Route path='/' element={<Main />}/>
          <Route path='/login' element={<ADEXLogin />} />
        </Routes>
      </main>
    </Router>
  )
}