import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Home } from "./pages/Home";
import { RecoilRoot } from "recoil";
import { Show } from "./pages/Show";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import LandingPage from "./pages/LandingPage";
import Bids from "./pages/Bids";
import BiddingArena from "./pages/BiddingArena";
import Payment from "./pages/Payment";
import Popup from "./components/Popup";
// import { Blog } from "./pages/Blog";
// import { Blogs } from "./pages/Blogs";

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Popup />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/home" element={<Home />} />
            <Route path="/show" element={<Show />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bids" element={<Bids />} />
            <Route path="/biddingarena" element={<BiddingArena />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
