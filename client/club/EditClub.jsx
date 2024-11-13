import React, {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Edit from '@mui/icons-material/Edit'
import auth from '../lib/auth-helper.js'
import {update} from './api-club.js'

export default function EditClub(props) {
    const [club, setClub] = useState({})
    const [open, setOpen] = useState(false)

//   const jwt = auth.isAuthenticated()
  const clickButton = () => {
    setOpen(true)
    setClub(props.club)
  }
  const SaveClub = () => {
    update({
        clubId: props.club._id
        }/*, {t: jwt.token}*/, club).then((data) => {
        if (data && data.error) {
            console.log(data.error);
        } else {
            window.location.reload();
        }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
  const handleChange = (event)=>{
    const {name, value} = event.target;
    setClub(prevClub => ({
        ...prevClub,
        [name]:value
    })
    )
}
const handleLeaderShipChange = (event)=>{
    const {name, value} = event.target;
    let leadership_name = name.split("_")[1];
    setClub(prevClub => ({
        ...prevClub,
        leadership: {
            ...prevClub.leadership,
            [leadership_name]: value
        }
    })
    )
}
const handleContactInfoStatus = (event, index)=>{
    const {contactInfo} = club;
    contactInfo[index].status = event.target.checked;

    setClub(prevClub => ({
        ...prevClub,
        contactInfo: contactInfo
    }));
}
const handleContactInfoUri = (event, index)=>{
    const {contactInfo} = club;
    contactInfo[index].uri = event.target.value;

    setClub(prevClub => ({
        ...prevClub,
        contactInfo: contactInfo
    }));
}

    return (<span>
        <IconButton aria-label="Edit" onClick={clickButton} color="primary">
            <Edit/>
        </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Edit Club"}</DialogTitle>
        <DialogContent>
        <DialogContentText>
                To edit club, please update club details here.
              </DialogContentText>
              <TextField
                required
                margin="dense"
                id="name"
                name="name"
                value={club.name}
                label="Club name"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="description"
                name="description"
                value={club.description}
                label="Description"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <div>
              <FormControl required  variant="standard" sx={{ mr: 1, minWidth: 200 }}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  required
                  labelId="status"
                  id="status"
                  name="status"
                  label="Status"
                  value={club.status}
                  onChange={handleChange}
                >
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"inactive"}>Inactive</MenuItem>
                  <MenuItem value={"suspended"}>Suspended</MenuItem>
                </Select>
              </FormControl>
              <FormControl required  variant="standard" sx={{ mr: 1, minWidth: 200 }}>
                <InputLabel id="type">Type</InputLabel>
                <Select
                  required
                  labelId="type"
                  id="type"
                  name="type"
                  label="Type"
                  value={club.type}
                  onChange={handleChange}
                >
                  <MenuItem value={"academic"}>Academic</MenuItem>
                  <MenuItem value={"sports"}>Sports</MenuItem>
                  <MenuItem value={"arts"}>Arts</MenuItem>
                  <MenuItem value={"cultural"}>Cultural</MenuItem>
                  <MenuItem value={"technology"}>Technology</MenuItem>
                  <MenuItem value={"volunteering"}>Volunteering</MenuItem>
                </Select>
              </FormControl>
              </div>
              <TextField
                required
                margin="dense"
                id="pictureUri"
                name="pictureUri"
                value={club.pictureUri}
                label="Picture Uri"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <Typography variant="h6" inline="true" sx={{ mt: 1 }}> 
                Leadership Info
              </Typography> 
              {club.leadership && <div>
                <TextField
                  sx={{ mr: 2 }}
                  required
                  margin="dense"
                  id="leadership_name"
                  name="leadership_name"
                  value={club.leadership[0].name}
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
                  value={club.leadership[0].email}
                  label="Email"
                  type="email"
                  variant="standard"
                  onChange={handleLeaderShipChange}
                />
            </div>}
            <Typography variant="h6" inline="true" sx={{ mt: 1 }}> 
                Contact Info
            </Typography> 
            {club.contactInfo && club.contactInfo.map((item, i) => { 
                return(<div key={i}>
                <Grid container alignContent="center" alignItems="center" direction="row" xs={12} >
                    <Grid>
                        <Checkbox checked={item.status} onChange={(event) =>handleContactInfoStatus(event, i)}/>
                    </Grid>
                    <Grid>
                        <TextField 
                            disabled={!item.status} 
                            fullWidth 
                            label={item.name} 
                            variant="standard"
                            value={item.uri}
                            onChange={(event) => handleContactInfoUri(event, i)}/>
                    </Grid>
                </Grid>
                </div>)
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={SaveClub} color="secondary" autoFocus="autoFocus">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </span>)
}
