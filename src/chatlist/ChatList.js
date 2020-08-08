import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import './style.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background,
        height: 'calc(100% - 10px)',
        position: 'absolute',
        left: '0',
        width: '350px',
        boxShadow: '0px 0px 0.5px black',
        overflowY: 'hidden'
      },
      listItem: {
        cursor: 'pointer',
        //opacity: '0.6',
        transition: '0.3s',
      },
      newChatBtn: {
        borderRadius: '8px',
        marginTop:'10px'
        
      },
      unreadMessage: {
        color: 'red',
        position: 'absolute',
        top: '0',
        right: '5px'
      }
    }));



function ChatListComponent(props){
    const classes = useStyles();

    function newChat(){
        console.log("new chat button clicked")
    }
    
    function selectChat(index){
        props.selectChatfn(index)
    }

    if(props.chats.length > 0){
        return(
            <Container className = {classes.root}>
                <Button variant = 'contained' fullWidth color='primary' className={`scrollbar ${classes.newChatBtn}`} onClick={newChat}>
                    New Message
                </Button>
                <List>
                {
                    props.chats.map((chat, index) => {
                        return(
                            <div key={index}>
                            <ListItem onClick={(e) => selectChat(index)} 
                            className={classes.listItem} 
                            selected={props.selectChatIndex == index} 
                            alignItems='flex-start'> 
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp">{chat.users.filter(user => user != props.userEmail)[0].split('')[0]}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={chat.users.filter(user => user != props.userEmail)[0]} 
                                secondary = {
                                    <React.Fragment>
                                        <Typography component = "span" color='textPrimary'>
                                            {chat.messages[chat.messages.length - 1].message.substring(0, 30)}...
                                        </Typography>
                                    </React.Fragment>
                                } >
                                    
                                </ListItemText>
                            </ListItem>
                            
                            </div>
                        )
                    })
                }
                </List>
    
            </Container>
        )
    } else{
        return(
            <Container className = {classes.root}>
                <Button variant='contained' fullWidth onClick={newChat} className={classes.newChatBtn} color="primary">
                    New Message
                </Button>
                <List></List>
            </Container>
        )
    }

    
}

export default ChatListComponent

