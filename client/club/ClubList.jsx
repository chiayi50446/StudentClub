import React from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {list} from './api-club.js';
import AddIcon from '@mui/icons-material/Add';
import AddClub from './AddClub.jsx'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 300,
        margin: "auto",
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
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
      }
}));

export default function ClubList() {

    const [clubList, setClubList] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        list(signal).then((data) => {
            console.log(data)
            if (data && data.error) { 
                console.log(data.error)
            } else { 
                console.log(data)
                setClubList(data)
            } 
        })
        return function cleanup(){ 
            abortController.abort()
        } 
    }, [])

  
    const classes = useStyles()
    return (
        <Paper className={classes.root} elevation={4}>
            <div className={classes.root}>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    sx={{ fontSize: '12px', margin: '5px' }}
                    size={12}
                >
                    <Grid sx={{ order: { xs: 2, sm: 1 } }}>
                        <Typography variant="h4" className={classes.title} inline="true"> 
                            All Clubs
                        </Typography> 
                    </Grid>
                    <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                        <Grid>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                                Add Club
                            </Button>
                            <AddClub 
                                isOpen={open}
                                handleClose={handleClose}>
                            </AddClub>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        
        <Grid container spacing={3}>
            
        {clubList.map((item, i) => { 
            return <Grid key={i}>
            <Card className={classes.card} >
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="200"
                  image={item.pictureUri}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
          </Card>
          </Grid>
        })} 
          </Grid>  
    </Paper>
    )
}