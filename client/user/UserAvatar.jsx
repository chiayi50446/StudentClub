import React, {useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar'
import Person from '@mui/icons-material/Person'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import auth from '../lib/auth-helper'

export default function UserAvatar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleMode = () => () => {
      handleClose();
    };
    return (
      <>
        <Avatar
          data-screenshot="toggle-mode"
          onClick={handleClick}
          size="small"
        >
          <Person/>
        </Avatar>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          aria-modal="true"
          open={open}
          onClose={handleClose}
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
