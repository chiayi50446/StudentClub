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

import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import UserAvatar from '../user/UserAvatar'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: '#0288d1',
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));
const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ffd966' } : { color: '#ffffff' };
};
export default function Menu(){
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <AppBar
    position="static"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        mb: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Avatar alt="Logo" src={LogoImg} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link to="/">
                  <IconButton aria-label="Home" style={isActive(location, "/")}>
                    <HomeIcon/>
                  </IconButton>
              </Link>
              <Link to="/about">
                <Button sx={{ p: 1 }} style={isActive(location, "/about")}>About</Button>
              </Link>
              {/* <Link to="/eventForm">
                <Button sx={{ p: 1 }} style={isActive(location, "/eventForm")}>EventForm</Button>
              </Link> */}
              <Link to="/eventList">
                <Button sx={{ p: 1 }} style={isActive(location, "/eventList")}>EventList</Button>
              </Link>
              <Link to="/users">
                <Button sx={{ p: 1 }} style={isActive(location, "/users")}>Users</Button>
              </Link>
              {/* {auth.isAuthenticated() && 
                <Link to={"/user/" + auth.isAuthenticated().user._id}>
                  <Button sx={{ p: 1 }} style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
                </Link>
              } */}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {!auth.isAuthenticated() && (<>
                <Link to="/signin">
                  <Button sx={{ p: 1 }} style={isActive(location, "/signin")}>Sign In</Button>
                </Link>
                <Link to="/signup">
                <Button sx={{ p: 1 }} style={isActive(location, "/signup")}>Sign up</Button>
                </Link>
              </>)
            }
            {/* {auth.isAuthenticated() && 
                <Button color="inherit" onClick={() => {auth.clearJWT(() => navigate('/'));}}>Sign out</Button>
            } */}
            {auth.isAuthenticated() && 
                <UserAvatar/>
            }
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon style={ { color: '#e3f2fd' }}/>
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>
                  <Link to="/" style={{ width: '100%' }}>
                    <Button fullWidth onClick={toggleDrawer(false)}><HomeIcon/></Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/about" style={{ width: '100%' }}>
                    <Button fullWidth onClick={toggleDrawer(false)}>About</Button>
                  </Link>
                </MenuItem>
                {/* <MenuItem>
                  <Link to="/eventForm" style={{ width: '100%' }}>
                    <Button fullWidth onClick={toggleDrawer(false)}>EventForm</Button>
                  </Link>
                </MenuItem> */}
                <MenuItem>
                  <Link to="/eventList" style={{ width: '100%' }}>
                    <Button fullWidth onClick={toggleDrawer(false)}>EventList</Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/users" style={{ width: '100%' }}>
                    <Button fullWidth onClick={toggleDrawer(false)}>Users</Button>
                  </Link>
                </MenuItem>
                {auth.isAuthenticated() && 
                  <MenuItem>
                    <Link to={"/user/" + auth.isAuthenticated().user._id} style={{ width: '100%' }}>
                      <Button fullWidth onClick={toggleDrawer(false)}>My Profile</Button>
                    </Link>
                  </MenuItem>
                }
                <Divider sx={{ my: 3 }} />
                {!auth.isAuthenticated() && (<>
                    <MenuItem>
                      <Button href="/signin" color="primary" variant="outlined" fullWidth>
                        Sign in
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button href="/signup" color="primary" variant="contained" fullWidth>
                        Sign up
                      </Button>
                    </MenuItem>
                  </>)
                }
                {auth.isAuthenticated() &&
                    <Button color="primary" variant="outlined" fullWidth onClick={() => {auth.clearJWT(() => navigate('/'));}}>Sign out</Button>
                }
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
);
};