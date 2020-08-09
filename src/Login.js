import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
const firebase = require("firebase");

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    noAccountHeader: {
        width: '100%',
        marginLeft: theme.spacing(15),
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3)* 2)]: {
          width: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
    hasAccountHeader: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(6),
        marginRight: theme.spacing(3),
      },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    Link: {
        width: '100%',
        textDecoration: 'none',
        textAlign: 'center',
        fontSize: "18px",
        color: '#303f9f',
        fontWeight: 'bolder',
        margin: theme.spacing(1, 22, 1),
    },
    showPassword: {
        marginLeft: theme.spacing(15),
        marginRight: theme.spacing(3),
    },
    errorText: {
        color: 'red',
        textAlign: 'center'
      }
}));



function LoginComponent(){
    const classes = useStyles();
    const history = useHistory();


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    function submitLogin(e){
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            history.push('/')
        }, err => {
            setError('Error Logging in. Please try again later')
            console.log(err)
        })
    }

    function userTyping(type, e){
        switch (type) {
            case 'email':
                 setEmail(e.target.value)
                 break;
 
             case 'password':
                 setPassword(e.target.value);
                 break;

             default:
                 break;
        }
    }



    return(
        <Container className = {classes.main} component = 'main' maxWidth = 'xs'>
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component = 'h1' variant = 'h5'> Log In!</Typography>
                <form className = {classes.form} onSubmit={(e) => submitLogin(e)}>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor="login-email-input">Enter Your Email</InputLabel>
                        <Input autoComplete="email" autoFocus id="login-email-input" onChange = {(e) => userTyping('email', e)}/>
                    </FormControl>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor="login-password-input">Enter Your Password</InputLabel>
                        <Input type = 'password' id="login-password-input" onChange = {(e) => userTyping('password', e)}/>
                    </FormControl>
                    {
                        error ? <Typography component = 'h5' variant = 'h6' className={classes.errorText}>Incorrect Login</Typography> : 
                        null
                    }
                    <Button type='submit' fullWidth variant = 'contained' color='primary' className={classes.submit}>Log In</Button>
                </form>
                <Typography component = 'h5' variant = 'h6' className={classes.noAccountHeader}> Don't Have An Account?</Typography>
                <Link className= {classes.Link} to='/signup'>Sign Up!</Link>
            </div>
            
        
        </Container>
    )
}


export default LoginComponent