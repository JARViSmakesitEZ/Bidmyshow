import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserSignup } from "./customer/pages/Signup";
import { UserSignin } from "./customer/pages/Signin";
import { UserHome } from "./customer/pages/Home";
import { RecoilRoot } from "recoil";
import { UserShow } from "./customer/pages/Show";
import UserProfile from "./customer/pages/Profile";
import UserBookings from "./customer/pages/Bookings";
import UserBids from "./customer/pages/Bids";
import UserBiddingArena from "./customer/pages/BiddingArena";
import UserPayment from "./customer/pages/Payment";
import Popup from "./customer/components/Popup";
import GlobalLandingPage from "./LandingPage";
import OrgLandingPage from "./theatre/pages/LandingPage";
import UserLandingPage from "./customer/pages/LandingPage";
import { OrgSignin } from "./theatre/pages/Signin";
import { OrgSignup } from "./theatre/pages/Signup";
import { OrgHome } from "./theatre/pages/Home";
import OrgProfile from "./theatre/pages/Profile";
import { OrgShow } from "./theatre/pages/Show";
import RegisterShow from "./theatre/pages/RegisterShow";
function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Popup />
          <Routes>
            <Route path="/" element={<GlobalLandingPage />} />
            ///////////user specific//////////////////
            <Route path="/user" element={<UserLandingPage />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/user/signin" element={<UserSignin />} />
            <Route path="/user/home" element={<UserHome />} />
            <Route path="/user/show" element={<UserShow />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/bookings" element={<UserBookings />} />
            <Route path="/user/bids" element={<UserBids />} />
            <Route path="/user/biddingarena" element={<UserBiddingArena />} />
            <Route path="/user/payment" element={<UserPayment />} />
            ////////////////////theatre specific/////////////////////////
            <Route path="/org" element={<OrgLandingPage />} />
            <Route path="/org/signup" element={<OrgSignup />} />
            <Route path="/org/signin" element={<OrgSignin />} />
            <Route path="/org/home" element={<OrgHome />} />
            <Route path="/org/profile" element={<OrgProfile />} />
            <Route path="/org/show" element={<OrgShow />} />
            <Route path="/org/registershow" element={<RegisterShow />} />
            {/*<Route path="/org/bookings" element={<Bookings />} />
            <Route path="/org/bids" element={<Bids />} />
            <Route path="/org/biddingarena" element={<BiddingArena />} />
            <Route path="/org/payment" element={<Payment />} /> */}
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
