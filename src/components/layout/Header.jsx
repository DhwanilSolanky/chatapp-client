import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Search as SearchIcon } from "@mui/icons-material";
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { Suspense, lazy, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { orange } from '../../constants/color';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import axios from "axios";
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from "../../redux/reducers/misc";
import { resetNotification } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationsDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isSearch} = useSelector((state) => state.misc);
  const {isNotification} = useSelector((state) => state.misc);
  const {notificationCount} = useSelector((state) => state.chat);
  const {isNewGroup} = useSelector((state) => state.misc);

  console.log("Notification Count => ", notificationCount);

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  }
  const openSearchDailog = () => {
    dispatch(setIsSearch(true));
  }
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  }
  const navigateToGroup = () => {
    navigate("/groups");
  }
  const logoutHandler = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/user/logout`, { withCredentials: true});
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    
  }
  const openNotifications = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotification());
  }
  return (
    <>
      <Box sx={{ flexGrow: 1, height: '4rem' }}>
        <AppBar position="static" sx={{ bgcolor: orange }}>
          <Toolbar>
            <Typography variant='h6' sx={{ display: { xs: "none", sm: "block" } }}>Whatsapp</Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color='inherit' onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn title={"Search"} onClick={openSearchDailog} icon={<SearchIcon />} />
              <IconBtn title={"Add New Group"} onClick={openNewGroup} icon={<AddIcon />} />
              <IconBtn title={"Manage Groups"} onClick={navigateToGroup} icon={<GroupIcon />} />
              <IconBtn title={"Notifications"} onClick={openNotifications} icon={<NotificationsIcon />} value={notificationCount}/>
              <IconBtn title={"Logout"} onClick={logoutHandler} icon={<LogoutIcon />} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        isSearch && <Suspense fallback={<Backdrop open></Backdrop>}>
          <SearchDialog />
        </Suspense>
      }
      {
        isNotification && <Suspense fallback={<Backdrop open></Backdrop>}>
          <NotificationsDialog />
        </Suspense>
      }
      {
        isNewGroup && <Suspense fallback={<Backdrop open></Backdrop>}>
          <NewGroupDialog />
        </Suspense>
      }
    </>
  )
}

const IconBtn = ({ title, onClick, icon, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {
          value ? <Badge badgeContent={value} color="error">{icon}</Badge> : icon
        }
      </IconButton>
    </Tooltip>
  );
};

export default Header
