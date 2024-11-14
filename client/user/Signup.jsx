import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, Typography, TextField, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { create } from './api-user'; // Make sure this API is correct.

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  error: {
    color: 'red',
    marginBottom: theme.spacing(2),
  },
  submit: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
  },
}));

export default function Signup() {
  const classes = useStyles();

  const [values, setValues] = useState({ 
    name: '',
    email: '',
    password: '',
    error: '',
  });

  const [open, setOpen] = useState(false); // State for success dialog.

  // Handle form field change
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value, error: '' }); // Clear error on input change
  };

  // Close success dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Validate and submit the form
  const clickSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (!values.name || !values.email || !values.password) {
      setValues({ ...values, error: 'All fields are required' });
      return;
    }

    // Create user object
    const user = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    // Call create API function from api-user.js
    create(user).then((data) => { 
      if (data && data.error) {
        setValues({ ...values, error: data.error }); // Show error if API returns an error
      } else {
        setOpen(true); // Open dialog if signup is successful
        setValues({ name: '', email: '', password: '', error: '' }); // Clear form after submission
      }
    }).catch((error) => {
      setValues({ ...values, error: 'An error occurred. Please try again later.' }); // Error handling
    });
  };

  Signup.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}> 
            Sign Up
          </Typography>

          {/* Show error message if any */}
          {values.error && <Typography className={classes.error}>{values.error}</Typography>}
          
          {/* Input fields for name, email, and password */}
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            type="password"
            margin="normal"
          />
        </CardContent> 
        <CardActions>
          {/* Changed button type to 'submit' */}
          <Button 
            color="primary" 
            variant="contained" 
            onClick={clickSubmit} 
            className={classes.submit}
            type="submit"
          >
            Submit
          </Button>
        </CardActions> 
      </Card>

      {/* Dialog for successful signup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/Signin">
            <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
              Sign In 
            </Button>
          </Link>
        </DialogActions> 
      </Dialog>
    </div>
  );
}
