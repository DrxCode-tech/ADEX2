import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Main from "./ADEX.jsx";
import CreateAcct from "./CreateAcct.jsx";

export default function App(){
  return (
    <Router >
      <main>
        <Routes >
          <Route path='/create' element={<CreateAcct />} />
          <Route path='/' element={<Main />}/>
        </Routes>
      </main>
    </Router>
  )
}