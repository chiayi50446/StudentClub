import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { create } from './api-club.js';  // Make sure this is the correct import for your API function
import AddIcon from '@mui/icons-material/Add';

export default function AddClub() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    type: '',
    leadership: {
      name: '',
      email: ''
    },
    pictureUri: '',
    contactInfo: [
      { name: 'Email', status: false, uri: '' },
      { name: 'Twitter', status: false, uri: '' },
      { name: 'Instagram', status: false, uri: '' }
    ]
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      status: '',
      type: '',
      leadership: { name: '', email: '' },
      pictureUri: '',
      contactInfo: [
        { name: 'Email', status: false, uri: '' },
        { name: 'Twitter', status: false, uri: '' },
        { name: 'Instagram', status: false, uri: '' }
      ]
    });
    handleClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleLeaderShipChange = (event) => {
    const { name, value } = event.target;
    const leadershipName = name.split('_')[1];
    setFormData((prevFormData) => ({
      ...prevFormData,
      leadership: {
        ...prevFormData.leadership,
        [leadershipName]: value
      }
    }));
  };

  const handleContactInfoStatus = (event, index) => {
    const { contactInfo } = formData;
    contactInfo[index].status = event.target.checked;

    setFormData((prevFormData) => ({
      ...prevFormData,
      contactInfo: contactInfo
    }));
  };

  const handleContactInfoUri = (event, index) => {
    const { contactInfo } = formData;
    contactInfo[index].uri = event.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      contactInfo: contactInfo
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    // Calling the create function to add a new club
    create(formData).then((data) => {
      if (data && data.error) {
        // Handle error, show feedback to the user
        console.log(data.error);
      } else {
        // On success, close the dialog and reload the page
        console.log(data);
        handleClose();
        window.location.reload(); // You can change this to a more efficient way of updating the UI if needed
      }
    });
  };

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
        Add Club
      </Button>
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: onSubmit }}>
        <DialogTitle>Add new club</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new club, please enter club details here.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            value={formData.name}
            label="Club name"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            value={formData.description}
            label="Description"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <div>
            <FormControl required variant="standard" sx={{ mr: 1, minWidth: 200 }}>
              <InputLabel id="status">Status</InputLabel>
              <Select
                required
                labelId="status"
                id="status"
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            <FormControl required variant="standard" sx={{ mr: 1, minWidth: 200 }}>
              <InputLabel id="type">Type</InputLabel>
              <Select
                required
                labelId="type"
                id="type"
                name="type"
                label="Type"
                value={formData.type}
                onChange={handleChange}
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
          <TextField
            required
            margin="dense"
            id="pictureUri"
            name="pictureUri"
            value={formData.pictureUri}
            label="Picture Uri"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <Typography variant="h6" inline="true" sx={{ mt: 1 }}>
            Leadership Info
          </Typography>
          <div>
            <TextField
              sx={{ mr: 2 }}
              required
              margin="dense"
              id="leadership_name"
              name="leadership_name"
              value={formData.leadership.name}
              label="Name"
              variant="standard"
              onChange={handleLeaderShipChange}
            />
            <TextField
              sx={{ mr: 2 }}
              required
              margin="dense"
              id="leadership_email"
              name="leadership_email"
              value={formData.leadership.email}
              label="Email"
              type="email"
              variant="standard"
              onChange={handleLeaderShipChange}
            />
          </div>
          <Typography variant="h6" inline="true" sx={{ mt: 1 }}>
            Contact Info
          </Typography>
          {formData.contactInfo.map((item, i) => {
            return (
              <div key={i}>
                <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                  <Grid>
                    <Checkbox checked={item.status} onChange={(event) => handleContactInfoStatus(event, i)} />
                  </Grid>
                  <Grid>
                    <TextField
                      disabled={!item.status}
                      fullWidth
                      label={item.name}
                      variant="standard"
                      value={item.uri}
                      onChange={(event) => handleContactInfoUri(event, i)}
                    />
                  </Grid>
                </Grid>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
