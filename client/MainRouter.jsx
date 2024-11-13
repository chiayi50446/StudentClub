import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './core/Home' 
import Users from './user/Users.jsx'
import Signup from './user/Signup.jsx'
import Signin from './lib/Signin.jsx'
import Profile from './user/Profile.jsx'
import PrivateRoute from './lib/PrivateRoute.jsx'
import EditProfile from './user/EditProfile.jsx'
import Menu from './core/Menu' 
import ClubList from './club/ClubList.jsx';
import Club from './club/Club.jsx'
import EventList from './event/EventList.jsx';
function MainRouter() {
  return (
    <div>
      <Menu/>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/clubs" element={<ClubList />} />
        <Route path="/club/:clubId" element={<Club />} />
        <Route path="/evnetList" element={<EventList />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/user/edit/:userId"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route path="/user/:userId" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default MainRouter;
