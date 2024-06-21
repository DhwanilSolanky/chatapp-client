import { Dialog, DialogTitle, Stack, TextField, InputAdornment, List, ListItem, ListItemText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material"
import UserItem from '../shared/UserItem';
import { sampleUsers } from '../../constants/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile, setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { useAsyncMutation } from '../../hooks/hooks';

const users = [1, 2, 3];

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
  const search = useInputValidation("");
  const addFriendHandler = async (_id) => {
    await sendFriendRequest("Sending friend request...", { userId: _id });
  }

  const [users, setUsers] = useState([]);

  const handleClose = () => {
    dispatch(setIsSearch(false));
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    }
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={handleClose}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label={""}
          value={search.value}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">

                <SearchIcon />

              </InputAdornment>
            ),
          }}
        />
        <List>
          {
            users?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search
