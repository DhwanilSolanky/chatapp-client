import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header';
import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from '../specific/ChatList';
import { sampleChats } from '../../constants/sampleData';
import { useNavigate, useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc';
import { useErrors, useSocketEvents } from '../../hooks/hooks';
import { getSocket } from '../../socket';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat';
import { getOrSaveFromStorage } from '../../lib/features';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';

const AppLayout = (WrappedComponent) => {
    return (props) => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const params = useParams();
        const chatId = params.chatId;
        const deleteMenuAnchor = useRef(null);
        const { user } = useSelector((state) => state.auth);
        const socket = getSocket();
        const { isMobile } = useSelector((state) => state.misc);
        const { newMessagesAlert } = useSelector((state) => state.chat);
        const [onlineUsers, setOnlineUsers] = useState([]);

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
        useErrors([{
            isError,
            error
        }]);

        useEffect(() => {
            getOrSaveFromStorage({
                key: NEW_MESSAGE_ALERT,
                value: newMessagesAlert
            })
        }, [newMessagesAlert]);

        const handleDeleteChat = (e, chatId, groupChat) => {
            //e.preventDefault();
            dispatch(setIsDeleteMenu(true));
            dispatch(setSelectedDeleteChat({chatId, groupChat}));
            deleteMenuAnchor.current = e.currentTarget;
        }

        const handleMobileClose = () => dispatch(setIsMobile(false));

        const newMessageAlertHandler = useCallback((data) => {
            if (data.chatId === chatId) return;
            dispatch(setNewMessagesAlert(data));
        }, [chatId]);

        const newRequestHandler = useCallback((data) => {
            dispatch(incrementNotification());
        }, [dispatch]);

        const refetchHandler = useCallback((data) => {
            refetch();
            navigate("/");
        }, [refetch, navigate]);

        const onlineUsersHandler = useCallback((data) => {
            setOnlineUsers(data);
        }, []);

        const eventHandler = {
            [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
            [NEW_REQUEST]: newRequestHandler,
            [REFETCH_CHATS]: refetchHandler,
            [ONLINE_USERS]: onlineUsersHandler,
        };

        useSocketEvents(socket, eventHandler);

        return (
            <>
                <Title />
                <Header />
                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid item sm={4} md={3} sx={{ display: { xs: "none", sm: "block" } }} height="100%">
                        {
                            isLoading ? (<Skeleton />)
                                :
                                <ChatList
                                    chats={data?.chats}
                                    chatId={chatId}
                                    handleDeleteChat={handleDeleteChat}
                                    newMessagesAlert={newMessagesAlert}
                                    onlineUsers={onlineUsers}
                                />
                        }
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height="100%"><WrappedComponent {...props} chatId={chatId} user={user} /></Grid>
                    <Grid item md={4} lg={3} height="100%" sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0, 0, 0, 0.85)" }}>
                        <Profile />
                    </Grid>
                </Grid>

                {
                    isLoading ? (<Skeleton />)
                        :
                        <Drawer open={isMobile} onClose={handleMobileClose}>
                            <ChatList
                                w='70vw'
                                chats={data?.chats}
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                                newMessagesAlert={newMessagesAlert}
                                onlineUsers={onlineUsers}
                            />
                        </Drawer>

                }

                <DeleteChatMenu dispatch={dispatch} deleteOptionAnchor={deleteMenuAnchor} />

            </>
        );
    }
};

export default AppLayout;
