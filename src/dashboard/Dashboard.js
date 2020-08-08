import React, {useState, useEffect} from 'react'
import ChatListComponent from '../ChatList/ChatList'
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import ChatViewComponent from "../viewchat/ChatView"
import ChatTextBoxComponent from '../ChatTextBox/ChatTextBox'
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

    function useForceUpdate(){
        const [value, setValue] = useState(0); // integer state
        return () => setValue(value => ++value); // update the state to force render
    }

export default function DashboardComponent(){
    const history = useHistory();
    const classes = useStyles();
    
    const [selectedChat, setSelectedChat] = useState(null)
    const [newChatFormVisible, setNewChatFormVisible] = useState(null)
    const [email, setEmail] = useState(null)
    const [chats, setChats] = useState([])
    const [changed, setChanged] = useState('')
    const [documentQueryKey, setDocumentQueryKey] = useState('')


    const forceUpdate = useForceUpdate();

    

    function createNewChat(){
        setNewChatFormVisible(true)
        setSelectedChat(null)
    }

    function selectChat(chatIndex){
        setSelectedChat(chatIndex);
        if(!documentQueryKey) return
        messageRead();
    }

    useEffect(() => {
        if(chats[selectedChat]){
            const documentQueryKey = builddocumentQueryKey(chats[selectedChat].users.filter(user => user !== email)[0]);
            setDocumentQueryKey(documentQueryKey)
            messageRead()
        }
    }, [selectedChat, setChanged])

    function signout(){
        firebase.auth().signOut();
    }

    function builddocumentQueryKey(friend){
         setDocumentQueryKey([email, friend].sort().join(':'));
         return [email, friend].sort().join(':');
    }

    function submitMesage(message){
        const documentQueryKey = builddocumentQueryKey(chats[selectedChat].users.filter(user => user !== email)[0]);
        firebase.firestore()
        .collection('chats')
        .doc(documentQueryKey)
        .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                sender: email,
                message: message,
                timeStamp: Date.now()
            }),
            recieverHasRead: false
        });
        
    }

    
    function messageRead(){ 
        forceUpdate();      
        if(!documentQueryKey) return;  
        if(chatClickedNotBySender(selectedChat)){
            console.log("ThiS SHIT RAN")
            firebase.firestore().collection('chats').doc(documentQueryKey).update({ recieverHasRead: true})
        } else {
            console.log("clicked message")
        }


    }

    function chatClickedNotBySender(chatIndex){
        if(chats[chatIndex]){
            return chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !== email
        }
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
                });
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
        {
            selectedChat !== null && !newChatFormVisible ? <ChatTextBoxComponent messageReadFn = {messageRead} sendMessagefn={submitMesage} /> : null
        }
        <Button onClick={signout} className = {classes.signOutBtn} variant = 'contained' fullWidth color='primary'>Sign Out</Button>
        </>
    )
}