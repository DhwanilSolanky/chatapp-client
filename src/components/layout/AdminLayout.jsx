import { Close as CloseIcon, Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Group as GroupIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from "@mui/icons-material";
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom';
import { matBlack } from "../../constants/color";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

const adminTabs = [
    {
        icon: <DashboardIcon />,
        name: "Dashboard",
        path: "/admin/dashboard",
    },
    {
        icon: <ManageAccountsIcon />,
        name: "Users",
        path: "/admin/users-management",
    },
    {
        icon: <GroupIcon />,
        name: "Chats",
        path: "/admin/chats-management",
    },
    {
        icon: <MessageIcon />,
        name: "Messages",
        path: "/admin/messages",
    }
]

const SideBar = ({ w = "100%" }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const logoutHandler = () => {
        dispatch(adminLogout());
    }
    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant='h5' textTransform={"uppercase"}>
                Admin
            </Typography>
            <Stack spacing={"1rem"}>
                {
                    adminTabs?.map((tab) => (
                        <Link key={tab.path} to={tab.path} sx={
                            location.pathname === tab.path && {
                                bgcolor: matBlack,
                                color: "white",
                                ":hover": {
                                    color: "white"
                                }
                            }
                        }>
                            <Stack direction={"row"} alignItems={"center"} spacing={'1rem'}>
                                {tab.icon}
                                <Typography>{tab.name}</Typography>
                            </Stack>
                        </Link>
                    ))
                }
                <Link onClick={logoutHandler}>
                    <Stack direction={"row"} alignItems={"center"} spacing={'1rem'}>
                        <ExitToAppIcon />
                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    );
}

//const isAdmin = true;

const AdminLayout = ({ children }) => {
    
    const {isAdmin} = useSelector((state) => state.auth);
    
    const [isMobile, setIsMobile] = useState(false);
    const handleMobile = () => {
        setIsMobile((prev) => !prev);
    }
    const handleClose = () => {
        setIsMobile(false);
    }


    if(!isAdmin) return <Navigate to={'/admin'}></Navigate>

    return (
        <Grid container minHeight={"100vh"}>
            <Box sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                right: "1rem",
                top: "1rem"
            }}>
                <IconButton color='inherit' onClick={handleMobile}>
                    {
                        isMobile ? <CloseIcon /> : <MenuIcon />
                    }
                </IconButton>
            </Box>
            <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
                <SideBar />
            </Grid>
            <Grid item xs={12} md={8} lg={9} sx={{
                bgcolor: "#f5f5f5",
            }}>
                {children}
            </Grid>

            <Drawer open={isMobile} onClose={handleClose} sx={{
                display: {
                    xs: "block",
                    md: "none",
                }
            }}>
                <SideBar w={"50vh"} />
            </Drawer>

        </Grid>
    )
}

export default AdminLayout
