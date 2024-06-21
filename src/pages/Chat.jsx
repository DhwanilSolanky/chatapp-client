import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import { orange } from '../constants/color';
import FileMenu from '../components/dialogs/FileMenu';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hooks';
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessageAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';




const Chat = ({ chatId, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const containerRef = useRef(null);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);
  const [iAmTyping, setIAmTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page: page });
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.message
  )
  const members = chatDetails?.data?.chat?.members;
  //console.log("OldMessages => ", oldMessagesChunk);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message }); //Emitting message to server
    setMessage("");

  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, {userId: user._id, members});
    dispatch(removeNewMessageAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, {userId: user._id, members});
    }
  }, [chatId]);


  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);


  useEffect(()=> {
    if(chatDetails.isError) return navigate("/");
  }, [chatDetails.isError])

  const newMessagesHandler = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);

  const startTypingHandler = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(true);
  }, [chatId]);

  const stopTypingHandler = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(false);
  }, [chatId]);

  const alertHandler = useCallback((data) => {
    if(data.chatId !== chatId) return;
    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "sdvdsvds",
        name: "Admin"
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, messageForAlert]);
  }, [chatId]);

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!iAmTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIAmTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIAmTyping(false);
    }, [2000]);

  }

  const eventHandler = {
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: startTypingHandler,
    [STOP_TYPING]: stopTypingHandler,
    [ALERT]: alertHandler
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];



  return (
    chatDetails.isLoading ? <Skeleton />
      :
      <>
        <Stack ref={containerRef}
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"1rem"}
          bgcolor={"lightgrey"}
          height={"90%"}
          sx={{
            overflowX: "hidden",
            overflowY: "auto"
          }}>
          {
            allMessages?.map((i) => (
              <MessageComponent message={i} user={user} key={i._id} />
            ))
          }
          {
            userTyping && <TypingLoader />
          }
          <div ref={bottomRef} />
        </Stack>
        <form style={{
          height: "10%"
        }}
          onSubmit={handleSubmit}
        >
          <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
            <IconButton sx={{
              position: "absolute",
              rotate: "30deg",
              left: "1.5rem"
            }}
              onClick={handleFileOpen}
            >
              <AttachFileIcon />
            </IconButton>
            <InputBox placeholder='Type message here.....' value={message} onChange={messageChangeHandler} />
            <IconButton type='submit' sx={{
              rotate: "-30deg",
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: "error.dark"
              }
            }}>
              <SendIcon />
            </IconButton>
          </Stack>
        </form>
        <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
      </>

  )
}

export default AppLayout(Chat);
