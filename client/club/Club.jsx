import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { read } from './api-club.js';
import {read as readUser} from '../user/api-user.js'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InstagramIcon from '@mui/icons-material/Instagram';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import DeleteClub from './DeleteClub.jsx';
import EditClub from './EditClub.jsx';
import auth from '../lib/auth-helper.js'

export default function Club() {
    const jwt = auth.isAuthenticated()
    const { clubId } = useParams();
    const [club, setClub] = useState(null); // Initializing club as null for better error handling
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers([]);
        const abortController = new AbortController();
        const signal = abortController.signal;

        read({ clubId: clubId }, signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
                setClub(null); // Set club to null if there's an error
            } else {
                setClub(data); // Update the club state with the fetched data
            }
        });

        return function cleanup() {
            abortController.abort(); // Cleanup on unmount
        };
    }, [clubId]);

    useEffect(() => {
        setUsers([]);
        if(club && club.leadership){
            club.leadership.map((item,i) => {
                const abortController = new AbortController()
                const signal = abortController.signal
                readUser({
                    userId: item.leadershipId
                }, {t: jwt.token}, signal).then((data) => {
                    if (data && data.error) {
                        console.log(data.error);
                    } else {
                        setUsers(oldArray => [...oldArray, data]);
                    }
                })
    
                return function cleanup(){
                    abortController.abort()
                }
            })
        }
    }, [club]);

    // If club data is null or not loaded yet, render loading or error message
    if (club === null) {
        return (
            <Paper elevation={4}>
                <Typography variant="h5" sx={{ textAlign: 'center', padding: 2 }}>
                    Unable to load club details. Please try again later.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={4}>
            <Grid container spacing={3}>
                <Grid>
                    <Box
                        component="img"
                        sx={{
                            width: 350,
                            maxWidth: { xs: 350, md: 250 },
                        }}
                        alt={club.name}
                        src={club.pictureUri}
                    />
                </Grid>
                <Grid>
                    <div>
                        <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            sx={{ fontSize: '12px', margin: '5px' }}
                            size={12}
                        >
                            <Grid sx={{ order: { xs: 2, sm: 1 } }}>
                                <Typography variant="h4" inline="true">
                                    {club.name}
                                </Typography>
                            </Grid>
                            <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                                <EditClub club={club} updateClub={setClub}/>
                                <DeleteClub clubId={clubId} />
                            </Grid>
                        </Grid>
                    </div>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <ListItem>
                            <ListItemText primary={club.description} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Status: ${club.status}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Type: ${club.type}`} />
                        </ListItem>
                        <Grid container spacing={2}>
                            <Grid xs={12} md={6}>
                                <Typography sx={{ mt: 1 }} variant="h6" component="div">
                                    Leadership Info
                                </Typography>
                                {users.length > 0 &&
                                    users.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} secondary={item.email} />
                                        </ListItem>
                                    ))}
                            </Grid>
                            <Grid xs={12} md={6}>
                                <Typography sx={{ mt: 1 }} variant="h6" component="div">
                                    Contact Info
                                </Typography>
                                {club.contactInfo &&
                                    club.contactInfo.map((contact, index) => (
                                        contact.uri && (
                                            <ListItem key={index}>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        {index === 0 ? <EmailIcon /> : index === 1 ? <TwitterIcon /> : <InstagramIcon />}
                                                    </ListItemIcon>
                                                    <ListItemText primary={contact.uri} />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    ))}
                            </Grid>
                        </Grid>
                    </List>
                </Grid>
            </Grid>
        </Paper>
    );
}
