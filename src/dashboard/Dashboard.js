import React, {useState, useEffect} from 'react'
import ChatListComponent from '../chatlist/ChatList'
import { useHistory } from 'react-router-dom';
const firebase = require('firebase')



export default function DashboardComponent(){
    const history = useHistory();
    
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
        console.log("selected a chat", chatIndex)
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
        </>
    )
}