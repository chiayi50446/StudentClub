import React from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import {list} from './api-user.js'
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link'
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import ArrowForward from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles(theme => ({
    card: {
      // Define your card styles here
    },
    textField: {
      // Define your text field styles here
    },
    error: {
      // Define your error icon styles here
    },
    submit: {
      // Define your submit button styles here
    },
    title: {
      // Define your title styles here
    },
    root: {
        // Define your root styles here
      },
  }));

export default function Users() {

    const [users, setUsers] = useState([])
useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then((data) => {
      console.log(data)
if (data && data.error) { 
console.log(data.error)
} else { 
    console.log(data)
setUsers(data)
} 
})
return function cleanup(){ 
abortController.abort()
} 
}, [])

  
    const classes = useStyles()
return (
  <Container maxWidth="lg">
<Paper className={classes.root} elevation={4}>
<Typography variant="h6" className={classes.title}> 
All Users
</Typography> 
<List dense>
{users.map((item, i) => { 
  return  <Link component={RouterLink} to={"/user/" + item._id} key={i}>
    
<ListItem> 
<ListItemAvatar>
<Avatar src={item.pictureUri} /> 

</ListItemAvatar>
<ListItemText primary={item.name}/> 
<ListItemSecondaryAction>
<IconButton>
<ArrowForward/> 
</IconButton>
</ListItemSecondaryAction> 
</ListItem>
</Link> 
})} 
</List>
</Paper>
</Container>
)
}


