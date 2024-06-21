import { useInputValidation } from '6pp';
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { sampleUsers } from '../../constants/sampleData';
import UserItem from '../shared/UserItem';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from "../../hooks/hooks"
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const NewGroup = () => {
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state) => state.misc);
  const groupName = useInputValidation("");

  const { isError, error, data, isLoading } = useAvailableFriendsQuery();

  const errors = [
    {
      isError,
      error
    }
  ];

  useErrors(errors);

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const [selectedMembers, setSelectedMembers] = useState([]);

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


  const submitHandler = () => {
    debugger;
    if (!groupName.value) return toast.error("Group Name must required");
    if (selectedMembers.length < 2) return toast.error("Please select atleast 3 members");
    newGroup("Creating...", { name: groupName.value, members: selectedMembers });
    closeHandler();
  }
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  }
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>
          New Group
        </DialogTitle>
        <TextField label={"Group Name"} value={groupName.value} onChange={groupName.changeHandler}></TextField>
        <Typography variant='body1'>Members</Typography>
        <Stack>
          {
            isLoading ? <Skeleton /> : data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          }
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant='text' color='error' size='large' onClick={closeHandler}>Cancel</Button>
          <Button variant='contained' size='large' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup
