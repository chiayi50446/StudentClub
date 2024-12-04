/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Edit from '@mui/icons-material/Edit'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container';
import DeleteUser from './DeleteUser'
import auth from '../lib/auth-helper.js'
import {read} from './api-user.js'
import {list } from '../club/api-club.js'
import {useLocation, Navigate, Link} from 'react-router-dom'
import { useParams } from 'react-router-dom';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import CircleIcon from '@mui/icons-material/Circle';
import stringAvatar from '../user/user-helper.js';

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.openTitle
  }
}))

export default function Profile({ match }) {
  const location = useLocation();
  const classes = useStyles()
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()
  const { userId } = useParams();
  const [clubList, setClubList] = useState([]);

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: userId
    }, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }

  }, [userId])

  useEffect(() => {
    setClubList([]);
    const abortController = new AbortController()
    const signal = abortController.signal
    if(user.clubList && user.clubList.length > 0){
      const query = {
        clubList: user.clubList.map(element => {
        return element.clubId
      })
      }

      list(signal, query).then((data) => {
        if (data && data.error) {
            console.log(data.error);
            setError('Failed to load clubs. Please try again later.');
        } else {
            setClubList(data);
        }
        setLoading(false); // End loading state once the data is fetched
      }).catch(() => {
      });
    }

    return function cleanup(){
      abortController.abort()
    }

  }, [user])
  
  const showEdit = () =>{
    if(!auth.isAuthenticated().user || !user._id)
      return false;

    if(user && user.name === 'admin'){
      return false;
    }
    if(auth.isAuthenticated().user._id == user._id){
      return true;
    }
    if(auth.isAuthenticated().user.isAdmin)
      return true;
    return false;
  }

  if (redirectToSignin) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
      
  }

    return (
      <Container maxWidth="lg">
        <ListItem alignItems="flex-start">
          <ListItemText>
            <Typography variant="h5" sx={{ mb: 2 }} className={classes.title}>
              Peronsal Profile
            </Typography>
          </ListItemText>
        </ListItem>
      <Paper elevation={4}>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              {user.pictureUri ? <Avatar src={user.pictureUri} /> : <Avatar {...stringAvatar(user.name)} />}
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.email}/> {
             showEdit() &&
              (<>
                <Link to={"/user/edit/" + user._id}>
                  <IconButton aria-label="Edit" color="primary">

                    <Edit/>
                  </IconButton>
                </Link>
                <DeleteUser userId={user._id}/>
              </>)
            }
          </ListItem>
        </List>
        
        <Divider/>
        <List dense>
          <Typography variant="h6" sx={{ p:1 }}>
            Added clubs
          </Typography>
          {clubList && clubList.map((item, i) => { 
            var color = item.status === "active" ? '#4caf50' : item.status === "inactive" ? '#607d8b' : '#ffc107';
            return (
            <ListItem
              key={i}
              secondaryAction={
                <Link to={"/club/" + item._id}>
                  <IconButton edge="end" >
                    <ReadMoreIcon />
                  </IconButton>
                </Link>
              }
            >
              <ListItemAvatar>
                <Avatar src={item.pictureUri}>
                </Avatar>
              </ListItemAvatar>

              <CircleIcon sx={{ fontSize: 10, mr:1, color:{color} }}></CircleIcon>
              <ListItemText
                primary={item.name}
              />
            </ListItem> )
            }
          )}
        </List>
        <Divider/>
        <List>
          <ListItem>
            <ListItemText primary={"Created: " + (
              new Date(user.created)).toDateString()}/>
          </ListItem>
        </List>
      </Paper>
      </Container>
    )
  }
