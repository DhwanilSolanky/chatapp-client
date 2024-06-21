import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import moment from 'moment'
import { CurvedButton, SearchField } from '../../components/styles/StyledComponents'
import { matBlack } from "../../constants/color"
import { DoughnutChart, LineChart } from '../../components/specific/Charts'
import { useFetchData } from '6pp'
import { Loaders } from '../../components/layout/Loaders'
import { useErrors } from '../../hooks/hooks'


const AppBar = () => {
    return (
        <Paper elevation={3} sx={{
            padding: "2rem",
            margin: "2rem 0",
            borderRadius: "1rem"
        }}>
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AdminPanelSettingsIcon sx={{
                    fontSize: "3rem"
                }} />
                <SearchField placeholder='Search...' />
                <CurvedButton>Search</CurvedButton>
                <Box flexGrow={1} />
                <Typography sx={{
                    display: {
                        xs: "none",
                        lg: "block",
                    },
                    color: "rgba(0,0,0,0.7)",
                    textAlign: "center"
                }}>{moment().format("MMMM Do YYYY")}</Typography>
                <NotificationsIcon />
            </Stack>
        </Paper>
    )
}

const Widgets = ({stats}) => {
    return (
        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            spacing={"2rem"}
            justifyContent={"space-between"}
            alignItems={"center"}
            margin={"2rem 0"}
        >
            <Widget title={"Users"} value={stats?.usersCount || 0} Icon={<PersonIcon />} />
            <Widget title={"Chats"} value={stats?.totalChatsCount || 0} Icon={<GroupIcon />} />
            <Widget title={"Messages"} value={stats?.messagesCount || 0 } Icon={<MessageIcon />} />
        </Stack>
    );
}


const Widget = ({ title, value, Icon }) => {
    return (

        <Paper
            sx={{
                padding: "2rem",
                margin: "2rem 0",
                borderRadius: "1.5rem",
                width: "20rem"
            }}
            elevation={3}
        >
            <Stack alignItems={"center"} spacing={"1rem"}>
                <Typography
                    sx={{
                        color: "rgba(0,0,0,0.7)",
                        borderRadius: "50%",
                        border: `5px solid ${matBlack}`,
                        width: "5rem",
                        height: "5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >{value}</Typography>
                <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                    {Icon}
                    <Typography>{title}</Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}

const Dashboard = () => {
    const { data, loading, error } = useFetchData(`http://localhost:3000/api/v1/admin/stats`, 'dashboard-stats');
    const { stats } = data || {};

    useErrors([
        {
            isError: error,
            error: error
        }
    ]);


    return loading ? <Loaders />
        :
        (
            <AdminLayout>
                <Container component={"main"}>
                    <AppBar />
                    <Stack
                        direction={{
                            xs: "column",
                            lg: "row"
                        }}

                        flexWrap={"wrap"}
                        justifyContent={"center"}
                        alignItems={{ xs: "center", lg: "stretch" }}
                        sx={{ gap: "2rem" }}
                    >
                        <Paper elevation={3} sx={{
                            width: "100%",
                            padding: "2rem 3.5rem",
                            borderRadius: "1rem",
                            maxWidth: "45rem"
                        }}>
                            <Typography variant='h4' m={"2rem 0"}>
                                Last Messages
                            </Typography>

                            <LineChart value={stats?.messagesChart || []} />

                        </Paper>

                        <Paper elevation={3}
                            sx={{
                                padding: "1rem",
                                borderRadius: "1rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: {
                                    xs: "100%",
                                    sm: "50%",
                                },
                                position: "relative",
                                width: "100%",
                                maxWidth: "25rem"
                            }}
                        >

                            <DoughnutChart labels={["Single Chats", "Groups Chats"]} value={[stats?.totalChatsCount - stats?.groupsCount || 0, stats?.groupsCount || 0]} />

                            <Stack
                                position={"absolute"}
                                direction={"row"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                spacing={"0.5rem"}
                                width={"100%"}
                                height={"100%"}
                            >

                                <GroupIcon />
                                <Typography>VS</Typography>
                                <PersonIcon />

                            </Stack>
                        </Paper>

                    </Stack>
                    <Widgets stats={stats}/>
                </Container>
            </AdminLayout>
        )
}

export default Dashboard
