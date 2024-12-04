import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { read } from './api-club.js';
import {read as readUser, list as listUser, update} from '../user/api-user.js'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InstagramIcon from '@mui/icons-material/Instagram';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import Alert from '@mui/material/Alert';
import DeleteClub from './DeleteClub.jsx';
import EditClub from './EditClub.jsx';
import auth from '../lib/auth-helper.js'
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForward from '@mui/icons-material/ArrowForward';
import stringAvatar from '../user/user-helper.js';
import IconButton from '@mui/material/IconButton';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';

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
        // const userId = auth.isAuthenticated().user._id;

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
                        if(auth.isAuthenticated() && auth.isAuthenticated().user._id===item.leadershipId){
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
            }
        })
    }

    const handleMovingMember = async(deleteMember) => {
        let deleteMemberDetail = {};
        const abortController = new AbortController()
        const signal = abortController.signal

        await readUser({
          userId: deleteMember._id
        }, signal).then((data) => {
          if (data && data.error) {
            setRedirectToSignin(true)
          } else {
            deleteMemberDetail = data;
          }
        })

        const { clubList } = deleteMemberDetail;
        const index = clubList.findIndex(obj => obj.clubId === clubId);
        clubList.splice(index, 1);

        // Remove from members list
        setMembers((prevMembers) => prevMembers.filter((member) => member._id !== deleteMember._id));

        deleteMemberDetail.clubList = clubList;
        if(deleteMember._id == user._id){
            setUser((prevUser) => ({
                ...prevUser,
                clubList: clubList
              }));
        }
        update({userId: deleteMember._id}, {t: jwt.token}, deleteMemberDetail).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUser(data);
                setInClub(false);
            }
        })

        return function cleanup(){
          abortController.abort()
        }
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
                <Grid container spacing={3} sx={{p:1}}>
                    <Grid>
                        <Box
                            component="img"
                            sx={{
                                width: 200,
                                maxWidth: { xs: 200, md: 200 },
                                m: 1
                            }}
                            alt={club.name}
                            src={club.pictureUri}
                        />
                        <Grid>
                            {auth.isAuthenticated() && !inClub && !auth.isAuthenticated().user.isAdmin && 
                            <Button variant="contained" onClick={handleJoinClub} sx={{m:1}}>
                                Join Club
                            </Button>}
                            
                            {auth.isAuthenticated() && inClub && !auth.isAuthenticated().user.isAdmin && 
                            <Button variant="contained" onClick={handleLeaveClub}sx={{m:1}}>
                                Leave Club
                            </Button>}
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Typography sx={{ ml: 1 }} variant="subtitle1" component="div">
                                Contact Info
                            </Typography>
                            {club.contactInfo.map((contact, index) => (
                                contact.uri && (
                                    <ListItem key={index} sx={{ p: 0, ml:1 }}>
                                        <ListItemIcon sx={{minWidth:'30px'}}>
                                            {index === 0 ? <EmailIcon fontSize="small"/> : index === 1 ? <TwitterIcon fontSize="small"/> : <InstagramIcon fontSize="small"/>}
                                        </ListItemIcon>
                                        <ListItemText secondary={contact.uri} />
                                    </ListItem>
                                    )
                                ))}
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
                                        <CircleIcon sx={{ fontSize: 15, mr:1, color:`${club.status === "active" ? '#4caf50' : club.status === "inactive" ? '#607d8b' : '#ffc107'}` }}/>
                                        {club.name}
                                    </Typography>
                                    <Typography variant="caption" inline="true" sx={{ fontSize: 15, ml:3, color: '#ec407a'}}>
                                        {club.type}
                                    </Typography>
                                </Grid>
                                {auth.isAuthenticated() && (clubAdmin || auth.isAuthenticated().user.isAdmin) &&
                                <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                                    <Link to="/eventForm" state={{ clubId: club._id }} >
                                        <Tooltip
                                          title="Add Event"
                                          slotProps={{
                                            popper: {
                                              modifiers: [
                                                {
                                                  name: 'offset',
                                                  options: { offset: [0, -14] },
                                                },
                                              ],
                                            },
                                          }}
                                        >
                                            <IconButton color="primary">
                                                <AddCircleIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
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
                                <Link to="/eventList" state={{ clubId: club._id }} >
                                    <Button endIcon={<ArrowForward />} sx={{p:0}}>
                                        View Events
                                    </Button>
                                </Link>
                            </ListItem>
                            <Grid container spacing={2}>
                                <Grid xs={12} md={6}>
                                    <Typography sx={{ mt: 1, ml:2 }} variant="h6" component="div">
                                        Leadership Info
                                    </Typography>
                                    {leaders.length > 0 &&
                                        leaders.map((item, index) => (
                                            <ListItem key={index}>
                                                    <ListItemAvatar>
                                                    {item.pictureUri ? <Avatar src={item.pictureUri} /> : <Avatar {...stringAvatar(item.name)} />}
                                                    </ListItemAvatar>
                                                <ListItemText primary={item.name} secondary={item.email} />
                                            </ListItem>
                                        ))}
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography sx={{ mt: 1 }} variant="h6" component="div">
                                        Member List
                                    </Typography>
                                    {members.length > 0 &&
                                        members.map((item, index) => (
                                            <ListItem key={index} secondaryAction={clubAdmin && 
                                                <IconButton size="small" color="action" onClick={()=>{handleMovingMember(item)}}>
                                                  <PersonRemoveIcon  fontSize="inherit"/>
                                                </IconButton>
                                              }>
                                                <ListItemAvatar>
                                                    {item.pictureUri ? <Avatar src={item.pictureUri} /> : <Avatar {...stringAvatar(item.name)} />}
                                                </ListItemAvatar>
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
