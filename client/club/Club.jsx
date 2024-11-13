import React from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import {read} from './api-club.js'
import Box from '@mui/material/Box';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import InstagramIcon from '@mui/icons-material/Instagram';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import DeleteClub from './DeleteClub.jsx'
import EditClub from './EditClub.jsx';


export default function Club() {

    const { clubId } = useParams();
    const [club, setClub] = useState({})

    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({
        clubId: clubId
      }, /*{t: jwt.token},*/ signal).then((data) => {
        if (data && data.error) {
          console.log(data.error)
        } else {
          setClub(data)
        }
      })
  
      return function cleanup(){
        abortController.abort()
      }
  
    }, [clubId])

  
    
    return (
        <Paper elevation={4}>            
          <Grid container spacing={3}>
            <Grid >
              <Box
                component="img"
                sx={{
                  // height: 233,
                  width: 350,
                  // maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="The house from the offer."
                src={club.pictureUri}
              />
            </Grid>
            <Grid >
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
                            {club.name}
                      </Typography> 
                    </Grid>
                    <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                      <EditClub club={club}/>
                      <DeleteClub clubId={clubId}/>
                    </Grid>
                </Grid>
              </div>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItem><ListItemText primary={club.description}/> </ListItem>
                <ListItem><ListItemText primary={"status:" + club.status}/> </ListItem>
                <ListItem><ListItemText primary={"type:" + club.type}/> </ListItem>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <Typography sx={{ mt: 1 }} variant="h6" component="div">
                      Leadership Info
                    </Typography>
                      <ListItem>
                      <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                      {club.leadership && <ListItemText primary={club.leadership[0].name} secondary={club.leadership[0].email}/> }           
                    </ListItem>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography sx={{ mt: 1 }} variant="h6" component="div">
                      Contact Info
                    </Typography>
                    {club.contactInfo && club.contactInfo[0].uri &&
                      <ListItem>
                        <ListItemButton>
                          <ListItemIcon>
                              <EmailIcon />
                          </ListItemIcon>
                          <ListItemText primary={club.contactInfo[0].uri} />
                        </ListItemButton>
                      </ListItem>
                    }
                    {club.contactInfo &&  club.contactInfo[1].uri &&
                      <ListItem>
                        <ListItemButton>
                          <ListItemIcon>
                              <TwitterIcon />
                          </ListItemIcon>
                          <ListItemText primary={club.contactInfo[1].uri} />
                        </ListItemButton>
                      </ListItem>
                    }
                    {club.contactInfo &&  club.contactInfo[2].uri &&
                      <ListItem>
                        <ListItemButton>
                          <ListItemIcon>
                              <InstagramIcon />
                          </ListItemIcon>
                          <ListItemText primary={club.contactInfo[2].uri} />
                        </ListItemButton>
                      </ListItem>
                    }
                  </Grid>
                </Grid>
              </List>
            </Grid>
          </Grid>  
        </Paper>
    )
}