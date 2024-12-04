import React, {useState, useEffect} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import auth from '../lib/auth-helper'
import {read} from './api-user.js'
import stringAvatar from '../user/user-helper.js';

export default function UserAvatar() {
    const navigate = useNavigate();
    const [user, setUser] = useState({})
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
      document.activeElement?.blur();
    };
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({
        userId: auth.isAuthenticated().user._id
      }, signal).then((data) => {
        if (data) {
          setUser(data)
        }
      })
  
      return function cleanup(){
        abortController.abort()
      }
  
    }, [])
    return (
      <>
        {user.pictureUri ? 
          <Avatar
            data-screenshot="toggle-mode"
            onClick={handleClick}
            size="small"
            src={user.pictureUri}
          /> : 
          <Avatar 
            data-screenshot="toggle-mode"
            onClick={handleClick}
            size="small"
            {...stringAvatar(user.name)} 
          />}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          aria-modal="true"
          open={open}
          onClose={handleClose}
          disableRestoreFocus
          onClick={handleClose}
          slotProps={{
            paper: {
              variant: 'outlined',
              elevation: 0,
              sx: {
                my: '4px',
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { navigate(`/user/${auth.isAuthenticated().user._id}`)}}>
            <Button color="primary" fullWidth>My Profile</Button>
          </MenuItem>
          <MenuItem onClick={() => {auth.clearJWT(() => navigate('/'));}}>
            <Button color="primary" fullWidth>Sign out</Button>
          </MenuItem>
        </Menu>
      </>
    );
}
