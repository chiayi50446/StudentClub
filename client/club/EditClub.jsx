import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Edit from '@mui/icons-material/Edit';
import { update } from './api-club.js';
import {list} from '../user/api-user.js';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditClub(props) {
  const [club, setClub] = useState({});

  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
        if (data && data.error) {
            console.log(data.error);
        } else {
          setUsers(data);
        }
    }).catch(() => {
        setError('An error occurred.');
    });

    return function cleanup() {
        abortController.abort();
    };
}, []);
  // Open dialog and set the current club data
  const clickButton = () => {
    setOpen(true);
    setClub(props.club); // Set club data when dialog opens
  };

  // Close dialog without saving
  const handleRequestClose = () => {
    setOpen(false);
    setError(null); // Clear any error on close
  };

  // Save updated club details
  const SaveClub = () => {
    update({ clubId: props.club._id }, club).then((data) => {
      if (data && data.error) {
        setError(data.error); // Set error if update fails
      } else {
        setOpen(false); // Close dialog on successful save
        window.location.reload(); // Reload to reflect changes
      }
    }).catch((err) => {
      setError('Failed to update club. Please try again.');
    });
  };

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setClub((prevClub) => ({
      ...prevClub,
      [name]: value,
    }));
  };

  // Handle leadership info change
  const handleLeaderShipChange = (event, index) => {
    const { leadership } = club;
    leadership[index].leadershipId = event.target.value;

    setClub((prevClub) => ({
      ...prevClub,
      leadership: leadership
    }));
  };

  const AddLeaderShip = () => {
    if(club.leadership.length === 3){
      return;
    }
    setClub((prevClub) => ({
      ...prevClub,
      leadership: [
        ...prevClub.leadership,
        {leadershipId:''}
      ]
    }))
  }

  const DeleteLeaderShip = (i) => {
    const { leadership } = club;
    leadership.splice(i, 1);
    setClub((prevClub) => ({
      ...prevClub,
      leadership: leadership
    }));
  }

  // Handle contact info change
  const handleContactInfoStatus = (event, index) => {
    const updatedContactInfo = [...club.contactInfo];
    updatedContactInfo[index].status = event.target.checked;
    setClub((prevClub) => ({
      ...prevClub,
      contactInfo: updatedContactInfo,
    }));
  };

  const handleContactInfoUri = (event, index) => {
    const updatedContactInfo = [...club.contactInfo];
    updatedContactInfo[index].uri = event.target.value;
    setClub((prevClub) => ({
      ...prevClub,
      contactInfo: updatedContactInfo,
    }));
  };

  useEffect(() => {
    if (open) {
      // Reset any errors when the dialog opens
      setError(null);
    }
  }, [open]);

  return (
    <span>
      <IconButton aria-label="Edit" onClick={clickButton} color="primary">
        <Edit />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>Edit Club</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit club, please update club details here.
          </DialogContentText>

          {/* Club Name */}
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            value={club.name || ''}
            label="Club name"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />

          {/* Club Description */}
          <TextField
            margin="dense"
            id="description"
            name="description"
            value={club.description || ''}
            label="Description"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />

          {/* Club Status */}
          <FormControl required variant="standard" sx={{ mr: 1, minWidth: 200 }}>
            <InputLabel id="status">Status</InputLabel>
            <Select
              labelId="status"
              id="status"
              name="status"
              value={club.status || ''}
              onChange={handleChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>

          {/* Club Type */}
          <FormControl required variant="standard" sx={{ mr: 1, minWidth: 200 }}>
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="type"
              id="type"
              name="type"
              value={club.type || ''}
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

          {/* Picture Uri */}
          <TextField
            required
            margin="dense"
            id="pictureUri"
            name="pictureUri"
            value={club.pictureUri || ''}
            label="Picture Uri"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />

          {/* Leadership Info */}
          <Typography variant="h6" inline="true" sx={{ mt: 1 }}>
            Leadership Info
            
          <IconButton aria-label="addLeaderShip" color="primary" disabled={club.leadership && club.leadership.length === 3} onClick={AddLeaderShip}>
              <AddIcon />
          </IconButton>
          </Typography>
          {club.leadership && club.leadership.map((item, i) => {
              return (
                <div key={i}>
                <FormControl required variant="standard" sx={{ mr: 1, minWidth: 200 }} >
                  <InputLabel id="leadership">Leadership {i+1}</InputLabel>
                  <Select
                    required
                    labelId="leadership"
                    id="leadership"
                    name="leadership"
                    label="leadership"
                    value={item.leadershipId}
                    onChange={(event) => handleLeaderShipChange(event, i)}
                  >
                    {users.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item._id}>{item.name}</MenuItem>
                    )})}
                  </Select>
                </FormControl>
                {i>0 && 
                    <IconButton aria-label="deleteLeaderShip" color="primary" 
                      onClick={()=>DeleteLeaderShip(i)}
                      sx={{ mt: 1.5 }}>
                        <DeleteIcon />
                    </IconButton>
                  }
                </div>
              )
          })}

          {/* Contact Info */}
          <Typography variant="h6" inline="true" sx={{ mt: 1 }}>
            Contact Info
          </Typography>
          {club.contactInfo &&
            club.contactInfo.map((item, i) => (
              <div key={i}>
                <Grid container alignItems="center">
                  <Grid>
                    <Checkbox
                      checked={item.status}
                      onChange={(event) => handleContactInfoStatus(event, i)}
                    />
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
            ))}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={SaveClub} color="secondary" autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
