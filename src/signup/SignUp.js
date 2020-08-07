import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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


function SignUpComponent(){
   const classes = useStyles();
   const [isShowing, setShowing] = useState(false)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [passwordConfirmation, setPasswordConfirmation] = useState("")
   const [error, setError] = useState('')
   const database = firebase.firestore();
   const history = useHistory();
   
   function submitSignup(e){
       e.preventDefault()
       if (!formIsValid()){
           setError("Passwords do not match")
           return;
       } else {
           setError('')
       }
       
       firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(authRes => {
            const userObj = {
                email: authRes.user.email,
                friends: [],
                messages: []
            };
            database.collection('users').doc(email).set(userObj)
            .then(() => {
                history.push('/dashboard')
            }, dbError => {
                console.log(dbError)
                setError(`Failed to Add user`)
            })
        }, authError => {
            console.log(authError)
            setError(`Failed to Add User. ${authError.message}` )
        })
   }


   function formIsValid(){
       return password === passwordConfirmation
   }

   function userTyping(type, e){
       switch (type) {
           case 'email':
                setEmail(e.target.value)
                break;

            case 'password':
                setPassword(e.target.value);
                if(formIsValid()){
                    setError('') 
                } 
                break;

            case 'passwordConfirmation':
                setPasswordConfirmation(e.target.value);
                if(formIsValid()){
                    setError('')
                }
                break;

            default:
                break;
       }
   }



    return(
       <Container className = {classes.main} component = 'main' maxWidth = 'xs'>
           <CssBaseline />
           <div className={classes.paper}>
            <Typography component = 'h1' variant = 'h5'>
                Sign Up
            </Typography>
            <form onSubmit={(e) => submitSignup(e)} className = {classes.form}>
                <FormControl required fullWidth margin = 'normal'>
                    <InputLabel htmlFor="signup-email-input"> Enter Your Email</InputLabel>
                    <Input autoComplete='email' autoFocus id ='signup-email-input' onChange={(e) => userTyping('email', e)}></Input>
                </FormControl>
                <FormControl required fullWidth margin='normal'>
                    <InputLabel htmlFor="signup-password-input">Create A Password</InputLabel>
                    <Input type = {!isShowing ? 'password' : 'any' } id="signup-password-input" onChange={(e) => userTyping('password', e)} />
                </FormControl>
                <FormControl required fullWidth margin='normal'>
                    <InputLabel htmlFor="signup-password-confirmation-input">Confirm Your Password</InputLabel>
                    <Input type = {!isShowing ? 'password' : 'any' } id="signup-password-confirmation-input" onChange={(e) => userTyping('passwordConfirmation', e)} />
                </FormControl>
                {
                    error ? <Typography className = {classes.errorText} component='h5' variant='h6'>{error}</Typography> : null
                }
                <FormControlLabel
                className={classes.showPassword}
                control={
                <Switch
                    checked={isShowing}
                    onChange={(e) => setShowing(e.target.checked )}
                    name="showPassword"
                    color="primary"
                />
                }
                label="Show Password"
                />
                <Button type='submit' fullWidth variant = 'contained' color='primary' className={classes.submit}>Submit</Button>
                
                </form>
                <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>Already Have An Account?</Typography>
                <Link className={classes.Link} to='/login' >Log In Here</Link>
           </div>
       </Container>
    )
}

export default SignUpComponent