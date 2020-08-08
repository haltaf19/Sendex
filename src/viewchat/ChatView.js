import React, {useState, useEffect} from 'react'
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';

const firebase = require('firebase')

const useStyles = makeStyles((theme) => ({
    content: {
        height: 'calc(100vh - 100px)',
        overflow: 'auto',
        padding: '25px',
        marginLeft: '350px',
        boxSizing: 'border-box',
        overflowY: 'scroll',
        top: '50px',
        width: 'calc(100% - 350px)',
        position: 'absolute'
      },
    
      userSent: {
        float: 'right',
        clear: 'both',
        padding: '20px',
        boxSizing: 'border-box',
        wordWrap: 'break-word',
        boxShadow: '0px 0px 0.5px black',
        marginTop: '10px',
        backgroundColor: 'rgba(211,211,211,0.2)',
        color: 'black',
        width: '400px',
        borderRadius: '10px'
      },
    
      friendSent: {
        float: 'left',
        clear: 'both',
        padding: '10px',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 1px black',
        wordWrap: 'break-word',
        marginTop: '10px',
        backgroundColor: 'rgba(64,64,64,0.1)',
        color: 'black',
        width: '400px',
        borderRadius: '10px'
      },
    
      chatHeader: {
        width: 'calc(100% - 350px)',
        height: '50px',
        backgroundColor: 'rgba(211,211,211,0.2)',
        position: 'fixed',
        marginLeft: '350px',
        fontSize: '18px',
        textAlign: 'center',
        color: 'black',
        paddingTop: '10px',
        boxSizing: 'border-box'
      }    
    }));

    export default function ChatViewComponent(props){
        const classes = useStyles();
        const {chat, user} = props
        
        useEffect(() =>{
            const container = document.getElementById('chatview-container')
            if(container){
                container.scrollTo(0, container.scrollHeight);
            }

        }, [chat])


        if(chat === undefined){       
            return(
                <Container className={classes.content} id='chatview-container'>

                </Container>
            )
        } else {
            return(
                <div>
                    <div className={classes.chatHeader}>
                        Your conversation with {chat.users.filter(usr => usr !== user)}
                    </div>
                        <Container className={classes.content} id='chatview-container'>
                            {
                                chat.messages.map((message, index) => {
                                    return(
                                        <div key={index} className={message.sender === user ? classes.userSent : classes.friendSent}>
                                            {message.message}
                                        </div>
                                        
                                    )
                                })
                            }
                            
                        </Container>
                </div>
            )
        }
    }