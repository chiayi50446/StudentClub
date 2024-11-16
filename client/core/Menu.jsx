import React from 'react'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import Button from '@mui/material/Button'
import auth from '../lib/auth-helper'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoImg from './../assets/images/Logo.jpg';


const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ffd966' } : { color: '#ffffff' };
};
export default function Menu(){
  const navigate = useNavigate();
  const location = useLocation();

  return (
  <AppBar position="static">
    <Toolbar>
    <Avatar alt="Logo" src={LogoImg} />
      <Typography variant="h6" color="inherit">
        Student Club
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(location, "/")}>
          <HomeIcon/>
        </IconButton>
      </Link>
      <Link to="/about">
        <Button style={isActive(location, "/about")}>About</Button>
      </Link>
      <Link to="/eventForm">
        <Button style={isActive(location, "/eventForm")}>EventForm</Button>
      </Link> 
      <Link to="/eventList">
        <Button style={isActive(location, "/eventList")}>EventList</Button>
      </Link>
      <Link to="/users">
        <Button style={isActive(location, "/users")}>Users</Button>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(location, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(location, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
               auth.clearJWT(() => navigate('/'));
            }}>Sign out</Button>
        </span>)
      }
    </Toolbar>
  </AppBar>
);
};