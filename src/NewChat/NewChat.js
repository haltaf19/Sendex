import React, {useState, useEffect} from 'react';
import { FormControl, InputLabel, Input, Button, withStyles, CssBaseline, Typography, createChainedFunction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
const firebase = require('firebase')


const useStyles = makeStyles((theme) => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
          width: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
      paper: {
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
        position: 'absolute',
        width: '400px',
        top: '100px',
        left: 'calc(50% + 150px - 175px)'
      },
      input: {
      },
      form: {
        width: '100%',
        marginTop: theme.spacing(5),
      },
      submit: {
        marginTop: theme.spacing(10)
      },
      errorText: {
        color: 'red',
        textAlign: 'center'
      }
}));

export default function NewChatComponent(props){
    const classes = useStyles();
    const history = useHistory();
    const [userName, setUserName] = useState('')
    const [message, setMessage] = useState('')
    const[error, setError] = useState(false)

    useEffect(()=>{
        if(!firebase.auth().currentUser)
            history.push('/login');
    }, [])


    async function submitNewChat(e){
        e.preventDefault();
        const userExists = await checkIfUserExists();
        if(userExists){
            const chatExists = await checkIfChatExists();
            chatExists ? goToChat() : createChat()
        }
    }

    function createChat(){
        props.newChatSubmitFn({
            sendTo:userName,
            message: message
        });   
    }

    function goToChat(){
        props.goToChatFn(buildDocKey(), message)
        props.goToChatFn(buildDocKey(), message)
    }

    async function checkIfUserExists(){
        const userSnapShot = await firebase.firestore().collection('users').get();
        const exists = userSnapShot.docs.map(doc => doc.data().email).includes(userName)
        setError(!exists);
        return exists;
    }

    async function checkIfChatExists(){
        const docKey = buildDocKey()
        const chat = await firebase.firestore().collection('chats').doc(docKey).get();
        return chat.exists;

    }

    function buildDocKey(){
        return [firebase.auth().currentUser.email, userName].sort().join(':');
    }

    function userTyping(type, e){
        switch(type){
            case 'userName':
                setError("");
                setUserName(e.target.value)

                break;
            
            case 'message':
                setError("");
                setMessage(e.target.value)
                break;

            default:
                break;
        }

    }

    return (
        <div className = {classes.main}>
            <Container className = {classes.main}>
                <CssBaseline />
                <div className = {classes.paper}>
                    <Typography component='h1' variant="h5">
                        Send A Message!
                    </Typography>
                    <form className={classes.form} onSubmit={e=> submitNewChat(e)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="new-chat-username">
                                Enter Your Friend's Email
                            </InputLabel>
                            <Input required 
                            className={classes.input} 
                            autoFocus 
                            onChange={(e) => userTyping('userName', e)} 
                            id='new-chat-username' />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-message'>Enter Your Message</InputLabel>
                            <Input 
                            required 
                            className={classes.input} 
                            onChange={e=>userTyping('message',e)} 
                            id='new-chat-message' />
                        </FormControl>
                        <Button fullWidth variant='contained' color='primary' className={classes.submit} type='submit'>Send</Button>
                        {
                            error ? 
                            <Typography component='h5' variant='h6' className={classes.errorText}>
                            User Does Not Exist
                            </Typography> :
                            null
                        }
                    </form>
                </div>
            </Container>

        </div>
    );

}