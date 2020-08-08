import React, {useState, useEffect} from 'react'
import ChatListComponent from '../chatlist/ChatList'
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import ChatViewComponent from "../viewchat/ChatView"
import Button from '@material-ui/core/Button';

const firebase = require('firebase')

const useStyles = makeStyles((theme) => ({
    signOutBtn: {
        position: 'absolute',
        bottom: '0px',
        left: '0px',
        marginBottom:'5px',
        width: '350px',
        borderRadius: '8px',
        backgroundColor: '#180945',
        height: '35px',
        boxShadow: '0px 0px 2px black',
        color: 'white'
      }
    }));


export default function DashboardComponent(){
    const history = useHistory();
    const classes = useStyles();
    
    const [selectedChat, setSelectedChat] = useState(null)
    const [newChatFormVisible, setNewChatFormVisible] = useState(null)
    const [email, setEmail] = useState(null)
    const [chats, setChats] = useState([])
    const [changed, setChanged] = useState('')

    function createNewChat(){
        setNewChatFormVisible(true)
        setSelectedChat(null)
    }

    function selectChat(chatIndex){
        setSelectedChat(chatIndex)
    }

    function signout(){
        firebase.auth().signOut();
    }

    useEffect(() =>{
        firebase.auth().onAuthStateChanged(async _usr => {
            if(!_usr)
              history.push('/login');
            else {
              await firebase
                .firestore()
                .collection('chats')
                .where('users', 'array-contains', _usr.email)
                .onSnapshot(async res => {
                  const chats = res.docs.map(_doc => _doc.data());
                  await setEmail(_usr.email)
                  await setChats(chats)
                  setChanged('is Changed')
                });
                console.log({
                    email,
                    _usr,
                    chats
                })
            }
        });
    },[changed]); 


    return(
        <>
        <ChatListComponent history={history} 
        newChatButtonFn={createNewChat} 
        selectChatfn={selectChat}
        chats={chats}
        userEmail={email}
        selectChatIndex={selectedChat} />
        {
            newChatFormVisible ? null : <ChatViewComponent user={email} chat={chats[selectedChat]} />
        }  
        <Button onClick={signout} className = {classes.signOutBtn} variant = 'contained' fullWidth color='primary'>Sign Out</Button>
        </>
    )
}