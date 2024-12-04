import React from 'react'
import {useState, useEffect} from 'react'
import ArrowForward from '@mui/icons-material/ArrowForward';
import Avatar from '@mui/material/Avatar'
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography'
import {list} from './api-user.js'
import { Link as RouterLink } from 'react-router-dom';
import stringAvatar from '../user/user-helper.js';


export default function Users() {

    const [name, setName] = useState("");
    const [users, setUsers] = useState([])
    const [filterUsers, setFilterUsers] = useState([])
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        list(signal).then((data) => {
          if (data && data.error) { 
              console.log(data.error)
          } else { 
              setUsers(data)
              setFilterUsers(data);
          } 
        })
      return function cleanup(){ 
        abortController.abort()
      } 
    }, [])

    useEffect(() => {
      let list = users;
      if (name !== "") {
        list = list.filter((user) => {
          return user.name.toLowerCase().includes(name.toLowerCase());
        });
      }
      setFilterUsers(list);
    }, [name]);
  
    return (
      <Container maxWidth="lg">
        <ListItem alignItems="flex-start">
        <ListItemText>
          <Typography variant="h5" sx={{ mb: 2 }}>
            User Management
          </Typography>
        </ListItemText>
      </ListItem>
      {/* Filter Section */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Search by Name"
          name="title"
            size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </Box>
      <div>
          <Stack direction="row" sx={{ mb: 1 }}>
            {name && (
              <Chip
                size="small"
                name="title"
                label={name}
                variant="outlined"
                onClick={() => setName("")}
                onDelete={() => setName("")}
              />
            )}
          </Stack>
        </div>
        <Paper elevation={4}>
          <List dense>
          {filterUsers.map((item, i) => { 
            return  <Link component={RouterLink} to={"/user/" + item._id} key={i}>
            <ListItem secondaryAction={
              <IconButton>
                <ArrowForward/> 
              </IconButton>
            }> 
              <ListItemAvatar>
                {item.pictureUri ? <Avatar src={item.pictureUri} /> : <Avatar {...stringAvatar(item.name)} />}
              </ListItemAvatar>
              <ListItemText primary={item.name}/>
            </ListItem>
            </Link> 
          })} 
          </List>
        </Paper>
      </Container>
    )
}


