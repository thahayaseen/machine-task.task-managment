import { Routes, Route } from "react-router-dom";

import Auth from "./components/auth/auth";
import RestaurantHome from "./components/Home/RestaurantHome";
import AllRestaurants from "./components/AllRestaurent";
import RestaurantDetails from "./components/Resturent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RestaurantHome />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/my-restaurants" element={<AllRestaurants />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      <Route path="/*" element={<>not Found</>} />
    </Routes>
  );
}

export default App;
