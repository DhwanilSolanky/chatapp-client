import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { Face as FaceIcon, AlternateEmail as EmailIcon, CalendarMonth as CalendarIcon } from "@mui/icons-material"
import moment from "moment";
import { useSelector } from 'react-redux';
import { transformImage } from '../../lib/features';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    
    return (
        <Stack spacing={"2rem"} alignItems={"center"}>
            <Avatar
                src={transformImage(user?.avatar?.url)}
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "5px solid white"
                }}>

            </Avatar>
            {/* <ProfileCard heading={"Bio"} text={"svsdvsdvsdvsdrgh"} /> */}
            <ProfileCard heading={"Username"} text={user?.username} Icon={<EmailIcon />} />
            <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
            <ProfileCard heading={"Joined"} text={moment('2024-01-01T00:00:00.000Z').fromNow()} Icon={<CalendarIcon />} />
        </Stack>
    )
}

const ProfileCard = ({ text, Icon, heading }) => {
    return (
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} color={"white"} textAlign={"center"}>
            {Icon && Icon}
            <Stack>
                <Typography variant='body1'>{text}</Typography>
                <Typography variant='caption' color={"gray"}>{heading}</Typography>
            </Stack>
        </Stack>
    )
}

export default Profile
