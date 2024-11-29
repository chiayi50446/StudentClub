import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { list } from "./api-club.js";
import AddClub from "./AddClub.jsx";
import CircularProgress from "@mui/material/CircularProgress"; // Added for loading indicator
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircleIcon from '@mui/icons-material/Circle';
import auth from '../lib/auth-helper.js'

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 340,
    maxWidth: 200,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
  },
  title: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  root: {
    padding: theme.spacing(3),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  noClubsContainer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "18px",
    color: theme.palette.text.secondary,
  },
  filterContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: theme.spacing(1),
  },
}));

export default function ClubList() {
  const [clubList, setClubList] = useState([]);
  const [filterClubList, setFilterClubList] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [type, setType] = useState(""); // Category filter state
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search term filter state

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Fetch clubs with filters
    list(signal, { category: type, name: searchTerm })
      .then((data) => {
        if (data && data.error) {
          console.log(data.error);
          setError("Failed to load clubs. Please try again later.");
        } else {
          setClubList(data);
          setFilterClubList(data);
        }
        setLoading(false); // End loading state once the data is fetched
      })
      .catch(() => {
        setError("An error occurred while fetching clubs.");
        setLoading(false); // End loading state on error
      });

    return function cleanup() {
      abortController.abort();
    };
  }, []); // Refetch data when filters change


  useEffect(() => {
    let list = clubList;
    if(type !== ''){
        list = list.filter((club) => {
            return club.type === type;
        });
    }
    if(status !== ''){
        list = list.filter((club) => {
            return club.status === status;
        });
    }
    if(searchTerm !== ''){
        list = list.filter((club) => {
            return club.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }
    setFilterClubList(list);
  }, [type, searchTerm, status]); // Refetch data when filters change

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
    <Container maxWidth="lg">
      <Paper className={classes.root} elevation={4}>
        <div>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{ xs: "column", sm: "row" }}
            sx={{ fontSize: "12px", margin: "5px" }}
            size={12}
          >
            <Grid sx={{ order: { xs: 2, sm: 1 } }}>
              <Typography variant="h4" className={classes.title} inline="true">
                All Clubs
              </Typography>
            </Grid>
            <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
              {auth.isAuthenticated() && auth.isAuthenticated().user.isAdmin &&<Grid>
                <AddClub />
              </Grid>}
            </Grid>
          </Grid>
        </div>
        <div className={classes.filterContainer}>
            <TextField 
                id="outlined-basic" 
                size="small" 
                variant="outlined" 
                placeholder="Search by name" 
                value={searchTerm} 
                sx={{ mr: 1 }}
                onChange={(e) => setSearchTerm(e.target.value)}/>
            <FormControl variant="outlined" size="small" sx={{ mr: 1, minWidth: 150 }}>
              <InputLabel id="status">Select Status</InputLabel>
              <Select
                label="Select Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" sx={{ mr: 1, minWidth: 150 }}>
              <InputLabel id="type">Select Type</InputLabel>
              <Select
                label="Select Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
                <MenuItem value="cultural">Cultural</MenuItem>
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="volunteering">Volunteering</MenuItem>
                </Select>
            </FormControl>
          
        </div>
        <div>
            <Stack direction="row"  sx={{mb:1}}>
                {searchTerm && <Chip
                size="small"
                  label={searchTerm}
                  variant="outlined"
                  onClick={(e) => setSearchTerm('')}
                  onDelete={(e) => setSearchTerm('')}
                />}
                {status && <Chip
                size="small"
                  label={status}
                  variant="outlined"
                  onClick={(e) => setStatus('')}
                  onDelete={(e) => setStatus('')}
                />}
                {type && <Chip
                size="small"
                  label={type}
                  onClick={(e) => setType('')}
                  onDelete={(e) => setType('')}
                />}
            </Stack>
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
          {filterClubList.map((item, i) => (
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
                    <CircleIcon sx={{ fontSize: 15, mr:1, color:`${item.status === "active" ? '#4caf50' : item.status === "inactive" ? '#607d8b' : '#ffc107'}` }}/>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button href={`/club/${item._id}`} size="small">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}
