import React, {useState, useEffect} from 'react'
import ChatListComponent from './ChatList/ChatList'
import NewChatComponent from './NewChat/NewChat'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import ChatViewComponent from "./viewchat/ChatView"
import ChatTextBoxComponent from './ChatTextBox/ChatTextBox'
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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
      },
    loading: {
        display:'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '25%',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
    }));

export default function DashboardComponent(){
    const history = useHistory();
    const classes = useStyles();
    
    const [selectedChat, setSelectedChat] = useState(null)
    const [newChatFormVisible, setNewChatFormVisible] = useState(null)
    const [email, setEmail] = useState(null)
    const [chats, setChats] = useState([])
    const [changed, setChanged] = useState('')
    const [documentQueryKey, setDocumentQueryKey] = useState('')

    function createNewChat(){
        setNewChatFormVisible(true)
        setSelectedChat(null)
    }


    function selectChat(chatIndex){
        setSelectedChat(chatIndex);
        setNewChatFormVisible(false)
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
        if(!chats[selectedChat])return;
        const documentQueryKey = builddocumentQueryKey(chats[selectedChat].users.filter(user => user !== email)[0])
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
        if(!documentQueryKey) return;  
        if(chatClickedNotBySender(selectedChat)){
            firebase.firestore().collection('chats').doc(documentQueryKey).update({ recieverHasRead: true})
        } else {
            return;
        }
    }

    async function goToChat(docKey, message){
        const usersInChat = docKey.split(':')
        const chat = chats.find(chat => usersInChat.every(user => chat.users.includes(user)))
        setNewChatFormVisible(false);
        await setSelectedChat(chats.indexOf(chat))
        submitMesage(message)
    }

    async function newChatSubmit(chatObj){
        const docKey = builddocumentQueryKey(chatObj.sendTo)
        await firebase.firestore().collection('chats').doc(docKey).set({
            recieverHasRead: false,
            users: [email, chatObj.sendTo],
            messages: [{
                message: chatObj.message,
                sender: email
            }]
        })
        setNewChatFormVisible(false)
        setSelectedChat(chats.length - 1)
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


    if(email && chats){
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
        {
            newChatFormVisible ? <NewChatComponent newChatSubmitFn={newChatSubmit} goToChatFn={goToChat}/> : null
        }
        <Button onClick={signout} className = {classes.signOutBtn} variant = 'contained' fullWidth color='primary'>Sign Out</Button>
        </>
    )
    } else{
        return(
            <Backdrop className={classes.backdrop}>
                <CircularProgress color="inherit" className={classes.loading}/>
            </Backdrop>
            
        );
    }
}