import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    sendBtn: {
        color: 'blue',
        cursor: 'pointer',
        '&:hover': {
          color: 'gray'
        }
    },
    
    chatTextBoxContainer: {
       position: 'absolute',
       bottom: '15px',
       left: '370px',
       boxSizing: 'border-box',
       overflow: 'auto',
       width: 'calc(100% - 320px - 50px)'
    },
    
    chatTextBox: {
       width: '90%'
      }
}));


export default function ChatTextBoxComponent(props){
    const classes = useStyles();

    const [chatText, setChatText] = useState('')



    function userTyping(e){
        e.keyCode === 13 ? sendMessage() : setChatText(e.target.value)
    }

    function isValidMessage(text){
        if (text && text.replace(/\s/g, '').length) return true;
        return false
    }

    function userClickedInput(){
        props.messageReadFn() 
    }

    function sendMessage(){
        if(isValidMessage(chatText)){
            props.sendMessagefn(chatText)
            setChatText('')
            document.getElementById('chattextbox').value= '';
        } 
    }
    


    return(
        <div className={classes.chatTextBoxContainer}> 
          <TextField placeholder="Type a message..." 
          onKeyUp={(e) => userTyping(e)} 
          id='chattextbox' 
          className={classes.chatTextBox}
          onFocus={userClickedInput}></TextField>  
          <Send onClick={sendMessage} className={classes.sendBtn}></Send>
        </div>
    )
}