import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import auth from '../lib/auth-helper.js'
import {remove} from './api-club.js'
import {Navigate} from 'react-router-dom'

export default function DeleteClub(props) {
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)

//   const jwt = auth.isAuthenticated()
  const clickButton = () => {
    setOpen(true)
  }
  const deleteClub = () => { 
    remove({
        clubId: props.clubId
    }/*, {t: jwt.token}*/).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        // auth.clearJWT(() => console.log('deleted'))
        setRedirect(true)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }

  if (redirect) {
    return <Navigate to='/'/>
  }
    return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete Club"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete this club.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteClub} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)

}
DeleteClub.propTypes = {
    clubId: PropTypes.string.isRequired
}




