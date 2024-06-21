import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../shared/ChatItem'

const ChatList = ({
    w = "100%",
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [
        {
            chatId: "",
            count: 0
        }
    ],
    handleDeleteChat
}) => {
    console.log("newMessagesAlert => ", newMessagesAlert);
  return (
    <Stack width={w} direction={'column'} sx={{
        overflow: "auto",
        height: "100%"
    }}>
        {
            chats?.map((data, index) => {
                const {avatar, _id, name, groupChat, members} = data;
                console.log(data);
                const newMessageAlert = newMessagesAlert.find(({chatId}) => {
                    return chatId.toString() === _id.toString();
                });
                console.log("newMessageAlert => ", newMessageAlert);
                const isOnline = members?.some((member) => onlineUsers.includes(member));
                return <ChatItem newMessageAlert={newMessageAlert}
                    isOnline={isOnline}
                    avatar={avatar}
                    name={name}
                    _id={_id}
                    key={_id}
                    groupChat={groupChat}
                    sameSender={chatId === _id}
                    index={index}
                    handleDeleteChat={handleDeleteChat}
                />
            })
        }
    </Stack>
  )
}

export default ChatList
