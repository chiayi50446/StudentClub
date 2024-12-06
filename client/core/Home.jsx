import React from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LogoImg from './../assets/images/Logo.jpg';
import Owner1Img from './../assets/images/TD_Chen.jpg';
import Owner2Img from './../assets/images/TD_Devani.jpg';
import Owner3Img from './../assets/images/TD_Lin.jpg';
import Owner4Img from './../assets/images/TD_Charmi.jpg';
import Owner5Img from './../assets/images/TD_Jeremy.jpg';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
  },
  title: {
    padding: theme.spacing(3, 2.5, 2),
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  ownersSection: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  ownerCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: 12,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    },
  },
  ownerImage: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: theme.spacing(1),
  },
  role: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing(1),
  },
  gridContainer: {
    marginTop: theme.spacing(2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const owners = [
    {
      name: 'Chen, Yu-Hsuan',
      image: Owner1Img,
      role: 'Club Backend Developer',
    },
    {
      name: 'Devani, Ishita',
      image: Owner2Img,
      role: 'User Front/Backend Developer',
    },
    {
      name: 'Lin, Chia-Yi',
      image: Owner3Img,
      role: 'Club Frontend Developer',
    },
    {
      name: 'Patel, Charmiben',
      image: Owner4Img,
      role: 'Club Event Frontend Developer',
    },
    {
      name: 'Salvador, Jeremy',
      image: Owner5Img,
      role: 'Club Event Backend Developer',
    },
  ];

  return (
    <Card className={classes.card}>
      <Typography variant="h6" className={classes.title}>
        About Page
      </Typography>
      <CardMedia
        className={classes.media}
        image={LogoImg}
        title="The Debuggers"
      />
      <CardContent>
        <Typography variant="body2" component="p">
          Welcome to the Student Club about page.
        </Typography>
      </CardContent>
      <CardContent className={classes.ownersSection}>
        <Typography variant="h6" className={classes.ownersTitle}>
          Members
        </Typography>
        <Grid container spacing={2} className={classes.gridContainer}>
          {owners.map((owner, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <div className={classes.ownerCard}>
                <img
                  src={owner.image}
                  alt={owner.name}
                  className={classes.ownerImage}
                />
                <Typography variant="h6">{owner.name}</Typography>
                <Typography className={classes.role}>{owner.role}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
