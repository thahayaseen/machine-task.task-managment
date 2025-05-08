
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Auth from "./components/auth/auth";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/*" element={<>not Found</>}/>
    </Routes>
  );
}

export default App;
