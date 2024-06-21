import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    DialogContentText,
    Stack,
    Typography,
} from '@mui/material';

import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem"
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';

const AddMemberDialog = ({ chatId }) => {
    const dispatch = useDispatch();
    const [members, setMembers] = useState(sampleUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const [addGroupMember, isLoadingAddGroupMember] = useAsyncMutation(useAddGroupMemberMutation);
    const { isAddMember } = useSelector((state) => state.misc);


    const { isError, error, data, isLoading } = useAvailableFriendsQuery(chatId);

    const errors = [
        {
            isError,
            error
        }
    ];

    useErrors(errors);

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => {
            if (prev.includes(id)) {
                // Remove the ID if it's already included
                return prev.filter((currEle) => currEle !== id);
            } else {
                // Add the ID if it's not included
                return [...prev, id];
            }
        });
    };

    // const addFriendHandler = (id) => {

    // }

    const closeHandler = () => {
        setMembers([]);
        setSelectedMembers([]);
        dispatch(setIsAddMember(false));
    }

    const addMemberSubmitHandler = () => {
        addGroupMember("Adding Members...", {
            members: selectedMembers,
            chatId: chatId,
        })
        closeHandler();
    }

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
                <Stack spacing={"0.5rem"}>
                    {
                        data?.friends?.length > 0 ? (
                            data?.friends?.map((i, index) => (
                                <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
                            ))
                        )
                            :
                            (
                                <Typography textAlign={"center"}>No Friends</Typography>
                            )

                    }
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                    <Button color="error" onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button color="primary" variant='contained' disabled={isLoadingAddGroupMember} onClick={addMemberSubmitHandler}>
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog
