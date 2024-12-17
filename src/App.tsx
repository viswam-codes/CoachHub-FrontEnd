import UserLayout from "./components/UserLayouts/UserLayout";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Signup from "./features/user/pages/Signup/Signup";
import LoginPage from "./features/user/pages/Login/Login";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<div>Home Page</div>} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </Router>
  );
    

};


export default App;
