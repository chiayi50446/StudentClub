import React, { useState, useEffect } from 'react';
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
import {list} from '../user/api-user.js';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton'
import auth from '../lib/auth-helper.js'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Resizer from "react-image-file-resizer";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
export default function AddClub(props) {
  const jwt = auth.isAuthenticated()
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    type: '',
    leadership: [{leadershipId: ''}],
    pictureUri: '',
    contactInfo: [
      { name: 'Email', status: false, uri: '' },
      { name: 'Twitter', status: false, uri: '' },
      { name: 'Instagram', status: false, uri: '' }
    ]
  });

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
      leadership: [{leadershipId: ''}],
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

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if(!file.type.startsWith('image/')){
      return;
    }
    await resizeFile(file);
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file, 200, 200, "JPEG", 50, 0,
        (uri) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            pictureUri: uri
          }));
        },
        "base64"
      );
    });

  const handleLeaderShipChange = (event, index) => {
    const { leadership } = formData;
    leadership[index].leadershipId = event.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      leadership: leadership
    }));
  };

  const AddLeaderShip = () => {
    if(formData.leadership.length === 3){
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      leadership: [
        ...prevFormData.leadership,
        {leadershipId:''}
      ]
    }))
  }

  const DeleteLeaderShip = (i) => {
    const { leadership } = formData;
    leadership.splice(i, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      leadership: leadership
    }));
  }

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
    create(formData, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        props.setClubList(oldArray => [...oldArray,data] )
        handleClose();
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
          <Grid container spacing={3}>
            <Grid>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 2 }}
              >
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  onChange={handlePictureUpload}
                  multiple
                  accept='image/*'
                />

              </Button>
            </Grid>
            <Grid>
              {formData.pictureUri && <img src={formData.pictureUri} width='40' height='40' style={{marginTop: '12px'}}/>}
            </Grid>
          </Grid>
          <Typography variant="h6" inline="true" sx={{ mt: 1 }}>
            Leadership Info
            
          <IconButton aria-label="addLeaderShip" color="primary" disabled={formData.leadership.length === 3} onClick={AddLeaderShip}>
              <AddIcon />
          </IconButton>
          </Typography>
          {formData.leadership && formData.leadership.map((item, i) => {
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
