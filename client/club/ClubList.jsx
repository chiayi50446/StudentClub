import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { list } from './api-club.js';
import AddClub from './AddClub.jsx';
import CircularProgress from '@mui/material/CircularProgress'; // Added for loading indicator

const useStyles = makeStyles(theme => ({
    card: {
        minHeight: 340,
        maxWidth: 300,
        margin: "auto",
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
    },
    title: {
        fontWeight: 'bold',
        color: theme.palette.primary.main
    },
    root: {
        padding: theme.spacing(3)
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
    },
    noClubsContainer: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '18px',
        color: theme.palette.text.secondary
    }
}));

export default function ClubList() {
    const [clubList, setClubList] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track errors

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
                setError('Failed to load clubs. Please try again later.');
            } else {
                setClubList(data);
            }
            setLoading(false); // End loading state once the data is fetched
        }).catch(() => {
            setError('An error occurred while fetching clubs.');
            setLoading(false); // End loading state on error
        });

        return function cleanup() {
            abortController.abort();
        };
    }, []);

    const classes = useStyles();

    if (loading) {
        return (
            <Paper className={classes.root} elevation={4}>
                <div className={classes.loadingContainer}>
                    <CircularProgress /> {/* Loading indicator */}
                </div>
            </Paper>
        );
    }

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
                            <AddClub />
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            {error && (
                <div className={classes.noClubsContainer}>
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </div>
            )}

            {clubList.length === 0 && !error && (
                <div className={classes.noClubsContainer}>
                    <Typography variant="h6" color="textSecondary">
                        No clubs available at the moment.
                    </Typography>
                </div>
            )}

            <Grid container spacing={3}>
                {clubList.map((item, i) => (
                    <Grid key={i}>
                        <Card className={classes.card}>
                            <CardMedia
                                component="img"
                                alt={item.name}
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
                                <Button href={"/club/" + item._id} size="small">
                                    Learn More
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}
