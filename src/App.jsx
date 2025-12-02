import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Main from "./ADEX/ADEX";
import CreateAcct from "./ADEX/CreateAcct";

export default function App(){
  return (
    <Router>
      <main className="w-full">
        <Routes >
          <Route path='/create' element={<CreateAcct />} />
          <Route path='/' element={<Main />}/>
        </Routes>
      </main>
    </Router>
  )
}