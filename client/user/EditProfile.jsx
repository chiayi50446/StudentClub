import React, {useState, useEffect} from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles'
import auth from '../lib/auth-helper.js'
import {read, update} from './api-user.js'
import {Navigate} from 'react-router-dom'
import { useParams } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2)
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectedTitle
    },
    error: {
        justifyContent: 'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    checkbox: {
        verticalAlign: 'middle',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submit: {
        justifyContent: 'center',
        margin: 'auto',
        marginBottom: theme.spacing(2)
    }
}))
export default function EditProfile({ match }) {
    const classes = useStyles()
    const { userId } = useParams();
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        isAdmin: false,
        open: false,
        error: '',
        redirectToProfile: false
    })
    const jwt = auth.isAuthenticated()
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        read({userId: userId}, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, name: data.name, email: data.email, isAdmin: data.isAdmin})
            }
        })
        return function cleanup(){
        abortController.abort()
        }
    }, [userId])
    const clickSubmit = () => {
        if(values.name.toLocaleLowerCase() === "admin"){
            setValues({...values, error: "user name cannot be 'admin'"})
            return;
        }
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
            isAdmin: values.isAdmin
        }
        update({userId: userId}, {t: jwt.token}, user).then((data) => {
            if (data && data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, userId: data._id, redirectToProfile: true})
            }
        })
    }
    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value, error:''})
    }
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setValues({...values, [name]: checked})
    }
    if (values.redirectToProfile) {
        return (<Navigate to={'/user/' + values.userId}/>)
    }
    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.title}>
                    Edit Profile
                </Typography>
                <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
                <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
                <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/><br/>
                {auth.isAuthenticated().user.isAdmin && 
                <FormControlLabel className={classes.checkbox} control={<Checkbox name="isAdmin" checked={values.isAdmin} onChange={handleCheckboxChange}/>}  label="Is Admin" />}
                <br/> 
                {values.error && 
                    <Alert severity="error"className={classes.error}>{values.error}</Alert>
                }
            </CardContent>
            <CardActions className={classes.submit}>
                <Button color="primary" variant="contained" onClick={clickSubmit} >Submit</Button>
            </CardActions>
        </Card>
    )
}

