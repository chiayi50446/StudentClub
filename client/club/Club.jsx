import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { read } from './api-club.js';
import {read as readUser} from '../user/api-user.js'
import {list as listUser} from '../user/api-user.js'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InstagramIcon from '@mui/icons-material/Instagram';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import Alert from '@mui/material/Alert';
import DeleteClub from './DeleteClub.jsx';
import EditClub from './EditClub.jsx';
import auth from '../lib/auth-helper.js'
import Button from '@mui/material/Button';
import {update} from '../user/api-user.js'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Club() {
    const jwt = auth.isAuthenticated()
    const { clubId } = useParams();
    const [club, setClub] = useState(null); // Initializing club as null for better error handling
    const [leaders, setLeaders] = useState([]);
    const [user, setUser] = useState(null);
    const [clubAdmin, setClubAdmin] = useState(false);
    const [inClub, setInClub] = useState(false);
    const [error, setError] = useState(null); // State to handle errors
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLeaders([]);
        setMembers([]);
        const abortController = new AbortController();
        const signal = abortController.signal;

        read({ clubId: clubId }, signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
                setClub(null); // Set club to null if there's an error
                setError('Failed to load users. Please try again later.');
            } else {
                setClub(data); // Update the club state with the fetched data
            }
            setLoading(false);
        });

        if(auth.isAuthenticated()){
            readUser({
                userId: auth.isAuthenticated().user._id
            }, signal).then((data) => {
                if(data){
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        setUser(data);
        
                        // Check in club or not
                        if(data.clubList){
                            const index = data.clubList.findIndex(obj => obj.clubId === clubId);
                            if(index >= 0){
                                setInClub(true);
                            }
                        }
                    }
                }else{
                    setError('Failed to get login user.');
                }
                
            });
        }

        // Get members
        const query = {clubId: clubId}
        listUser(signal, query).then((data) => {
        if (data && data.error) {
            console.log(data.error);
            setError('Failed to load users. Please try again later.');
        } else {
            setMembers(data);
        }
        setLoading(false); // End loading state once the data is fetched
        }).catch(() => {
        });

        return function cleanup() {
            abortController.abort(); // Cleanup on unmount
        };
    }, [clubId]);

    useEffect(() => {
        setLeaders([]);
        setClubAdmin(false);
        const userId = auth.isAuthenticated().user._id;

        if(club && club.leadership){
            club.leadership.map((item,i) => {
                const abortController = new AbortController()
                const signal = abortController.signal
                readUser({
                    userId: item.leadershipId
                }, signal).then((data) => {
                    if (data && data.error) {
                        console.log(data.error);
                    } else {
                        setLeaders(oldArray => [...oldArray, data]);
                        if(userId==item.leadershipId && !clubAdmin){
                            setClubAdmin(true);
                        }
                    }
                })
    
                return function cleanup(){
                    abortController.abort()
                }
            })
        }
    }, [club]);

    const handleJoinClub = () => {
        const { clubList } = user;
        clubList.push({clubId: clubId});
        
        // Add in members list
        setMembers((prevMembers) => [...prevMembers, user]);

        setUser((prevUser) => ({
          ...prevUser,
          clubList: clubList
        }));
        const userId = auth.isAuthenticated().user._id;
        update({userId: userId}, {t: jwt.token}, user).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUser(data);
                setInClub(true);
                console.log(data)
            }
        })
    }

    const handleLeaveClub = () => {
        // if(clubAdmin){
        //     setError("Club leadership can't leave club")
        //     return;
        // }
        const { clubList } = user;
        const index = clubList.findIndex(obj => obj.clubId === clubId);
        clubList.splice(index, 1);

        // Remove from members list
        setMembers((prevMembers) => prevMembers.filter((member) => member._id !== user._id));

        setUser((prevUser) => ({
          ...prevUser,
          clubList: clubList
        }));
        const userId = auth.isAuthenticated().user._id;
        update({userId: userId}, {t: jwt.token}, user).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUser(data);
                setInClub(false);
                console.log(data)
            }
        })
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={4}>
                {error && <Alert severity="error">{error}</Alert>}
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                {club &&
                <Grid container spacing={3}>
                    <Grid>
                        <Box
                            component="img"
                            sx={{
                                width: 200,
                                maxWidth: { xs: 200, md: 200 },
                            }}
                            alt={club.name}
                            src={club.pictureUri}
                        />
                        <Grid>
                            {auth.isAuthenticated() && !inClub && !auth.isAuthenticated().user.isAdmin && <Button variant="contained" onClick={handleJoinClub}>
                                Join Club
                            </Button>}
                            
                            {auth.isAuthenticated() && inClub && !auth.isAuthenticated().user.isAdmin && <Button variant="contained" onClick={handleLeaveClub}>
                                Leave Club
                            </Button>}
                        </Grid>
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
                                {auth.isAuthenticated() && (clubAdmin || auth.isAuthenticated().user.isAdmin) &&
                                <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                                    <EditClub club={club} updateClub={setClub}/>
                                    <DeleteClub clubId={clubId} />
                                </Grid>}
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
                                    {leaders.length > 0 &&
                                        leaders.map((item, index) => (
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
                                <Grid xs={12} md={6}>
                                    <Typography sx={{ mt: 1 }} variant="h6" component="div">
                                        Member List
                                    </Typography>
                                    {members.length > 0 &&
                                        members.map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <PersonIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={item.name} secondary={item.email} />
                                            </ListItem>
                                        ))}
                                </Grid>
                            </Grid>
                        </List>
                    </Grid>
                </Grid>
                }
            </Paper>
        </Container>
    );
}
