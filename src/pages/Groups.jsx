import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, Icon, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { useState, memo, useEffect, lazy } from 'react'
import { matBlack } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents"
import AvatarCard from "../components/shared/AvatarCard"
import { sampleChats, sampleUsers } from "../constants/sampleData"
import { Suspense } from 'react';
import UserItem from '../components/shared/UserItem';
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors, useSocketEvents } from '../hooks/hooks';
import { Loaders } from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';


const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));

const isAddNew = false;

const Groups = () => {
    const dispatch = useDispatch();
    const chatId = useSearchParams()[0].get("group");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [members, setMembers] = useState([]);
    const { isAddMember } = useSelector((state) => state.misc);
    const navigate = useNavigate();

    const myGroups = useMyGroupsQuery("");

    const groupDetails = useChatDetailsQuery(
        { chatId, populate: true },
        { skip: !chatId }
    );

    const [renameGroupName, isLoadingRenameGroupName] = useAsyncMutation(useRenameGroupMutation);
    const [removeGroupMember, isLoadingRemoveGroupMember] = useAsyncMutation(useRemoveGroupMemberMutation);
    const [deleteChat, isLoadingDeleteChat] = useAsyncMutation(useDeleteChatMutation);
    

    const errors = [
        {
            isError: myGroups.isError,
            error: myGroups.error,
        },
        {
            isError: groupDetails.isError,
            error: groupDetails.error,
        }
    ];

    useErrors(errors);


    const navigateBack = () => {
        navigate("/")
    }
    const handleMobile = () => {
        setIsMobileMenuOpen((prev) => !prev);
    }

    const handleMobileClose = () => {
        setIsMobileMenuOpen(false);
    }

    const updateGroupName = () => {
        setIsEdit(false);
        renameGroupName("Renaming Group Name...", {chatId, name: groupNameUpdatedValue});
    }

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    }

    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    }

    const addMemberHandler = () => {
        dispatch(setIsAddMember(true));
    }
    const deleteHandler = () => {
        deleteChat("Deleting Group...", chatId);
        closeConfirmDeleteHandler();
        navigate("/groups");
    }

    useEffect(() => {
        if (chatId) {
            setGroupName(`Group Name ${chatId}`);
            setGroupNameUpdatedValue(`Group Name ${chatId}`);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setIsEdit(false);
        }
    }, [chatId]);


    useEffect(() => {
        if (groupDetails.data) {
            setGroupName(groupDetails.data.chat.name);
            setGroupNameUpdatedValue(groupDetails.data.chat.name);
            setMembers(groupDetails.data.chat.members);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setMembers([]);
            setIsEdit(false);
        }
    }, [groupDetails.data]);

    const removeFriendHandler = (userId) => {
        removeGroupMember("Removing Member...", { chatId, userId });
    }

    const IconBtns = <>
        <Box sx={{
            display: {
                xs: "block",
                sm: "none",
                position: "fixed",
                right: "1rem",
                top: "1rem"
            }
        }}>
            <IconButton onClick={handleMobile}>
                <MenuIcon />
            </IconButton>
        </Box>

        <Tooltip title="back">
            <IconButton sx={{
                position: "absolute",
                top: "2rem",
                left: "2rem",
                bgcolor: matBlack,
                color: "white",
                "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                },
            }}
                onClick={navigateBack}>
                <KeyboardBackspaceIcon />
            </IconButton>
        </Tooltip>
    </>

    const GroupName = <>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
            {
                isEdit ? <>
                    <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
                    <IconButton onClick={updateGroupName} disabled={isLoadingRenameGroupName}>
                        <DoneIcon />
                    </IconButton>
                </>
                    :
                    <>
                        <Typography variant='h4'>{groupName}</Typography>
                        <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingRenameGroupName}>
                            <EditIcon />
                        </IconButton>
                    </>
            }
        </Stack>
    </>

    const ButtonGroup = <>
        <Stack
            direction={{
                sm: "row",
                xs: "column-reverse"
            }}
            spacing={"1rem"}
            p={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem"
            }}
        >
            <Button size='large' color='error' variant='outlined' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>
                Delete Group
            </Button>
            <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={addMemberHandler}>Add Member</Button>
        </Stack>
    </>

    return myGroups.isLoading ? <Loaders /> : (
        <Grid container height={"100vh"}>
            <Grid item sx={{
                display: {
                    xs: "none",
                    sm: "block"
                },
                bgcolor: "bisque"
            }} sm={4}>
                <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Grid>
            <Grid item xs={12} sm={8} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "1rem 3rem" }}>
                {IconBtns}
                {groupName && <>
                    {GroupName}
                    <Typography
                        m={"2rem"}
                        alignSelf={"flex-start"}
                        variant='body1'
                    >Members</Typography>
                    <Stack
                        maxWidth={"45rem"}
                        width={"100%"}
                        boxSizing={"border-box"}
                        padding={{
                            sm: "1rem",
                            xs: "0",
                            md: "1rem 4rem"
                        }}
                        spacing={"2rem"}
                        height={"50vh"}
                        overflow={"auto"}
                    >
                        {/* Members */}
                        {
                            isLoadingRemoveGroupMember ? <CircularProgress /> : groupDetails?.data?.chat?.members.map((i, index) => (
                                <UserItem user={i} isAdded styling={{
                                    boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.2)",
                                    padding: "1rem 2rem",
                                    borderRadius: "1rem"
                                }}
                                    handler={removeFriendHandler}
                                    key={i._id}
                                />
                            ))
                        }
                    </Stack>
                    {ButtonGroup}
                </>
                }
            </Grid>
            {confirmDeleteDialog && (
                <Suspense fallback={<Backdrop open />}> {/* Use Backdrop as fallback */}
                    <ConfirmDeleteDialog
                        open={confirmDeleteDialog}
                        handleClose={closeConfirmDeleteHandler}
                        deleteHandler={deleteHandler} // Pass your delete handler function here
                    />
                </Suspense>
            )}
            {isAddMember && (
                <Suspense fallback={<Backdrop open />}> {/* Use Backdrop as fallback */}
                    <AddMemberDialog chatId={chatId}/>
                </Suspense>
            )}
            <Drawer open={isMobileMenuOpen} onClose={handleMobileClose} sx={{
                display: {
                    xs: "block",
                    sm: "none",
                }
            }}>
                <GroupsList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Drawer>
        </Grid>
    )
}


const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
    <Stack width={w} sx={{
        height: "100vh",
        overflow: "auto"
    }}>
        {
            myGroups.length > 0 ?
                (
                    myGroups?.map((i, index) => {
                        return <GroupListItem group={i} chatId={chatId} key={i._id} />
                    })
                )
                :
                (
                    <Typography textAlign={"center"} padding={"1rem"}>No Groups</Typography>
                )
        }
    </Stack>
)

const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;
    return (
        <Link to={`?group=${_id}`} onClick={(e) => { if (chatId === _id) e.preventDefault() }}>
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AvatarCard avatar={avatar} />
                <Typography>{name}</Typography>
            </Stack>
        </Link>
    );
});


export default Groups
