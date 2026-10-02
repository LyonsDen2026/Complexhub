import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Memberships from "./pages/Memberships.jsx";
import Book from "./pages/Book.jsx";
import Coaches from "./pages/Coaches.jsx";
import Shop from "./pages/Shop.jsx";
import Workouts from "./pages/Workouts.jsx";
import Rewards from "./pages/Rewards.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/book" element={<Book />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}
