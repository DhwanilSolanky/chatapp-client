import React, { useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { CameraAlt as CameraAltIcon } from "@mui/icons-material"
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { useFileHandler, useInputValidation } from "6pp";
import { usernameValidator } from '../utils/validators'
import { useDispatch } from 'react-redux';
import { userExists, userNotExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toggleLogin = () => setIsLogin((prev) => !prev);
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation();
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Signing In...");
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    try {
      const { data } = await axios.post(`http://localhost:3000/api/v1/user/new`, formData, config);
      dispatch(userExists(data.user));
      toast.success(data.message, {id: toastId});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {id: toastId});
    } finally{
      setIsLoading(false);
    }
  }

  const handleLogIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging In...");
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const { data } = await axios.post(`http://localhost:3000/api/v1/user/login`, {
        username: username.value,
        password: password.value
      }, config);
      dispatch(userExists(data.user));
      toast.success(data.message, {id: toastId});
      //fetchUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {id: toastId});
    } finally {
      setIsLoading(false);
    }
  }

  // const fetchUser = async () => {

  //   await axios.get(`http://localhost:3000/api/v1/user/myProfile`, { withCredentials: true }).then(({ data }) => dispatch(userExists(data.user))).catch((err) => dispatch(userNotExists()));
  // };

  return (
    <Container maxWidth="xs" component={"main"} sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {
          isLogin ? (
            <>
              <Typography variant='h5'>Login</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleLogIn}>
                <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />
                <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler} />
                <Button
                  sx={{
                    marginTop: "1rem"
                  }}
                  variant='contained'
                  color='primary'
                  type='submit'
                  fullWidth
                  disabled={isLoading}
                >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
                <Button

                  variant='text'
                  fullWidth
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  Sign Up
                </Button>
              </form>
            </>
          )
            :
            (
              <>
                <Typography variant='h5'>Sign Up</Typography>
                <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignUp}>
                  <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                    <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "cover" }} src={avatar.preview}>
                    </Avatar>
                    <IconButton sx={{ position: "absolute", bottom: "0", right: "0", color: "white", bgcolor: "rgba(0, 0, 0, 0.5)", ":hover": { bgcolor: "rgba(0,0,0,0.7" } }} component="label">
                      <>
                        <CameraAltIcon />
                        <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}></VisuallyHiddenInput>
                      </>
                    </IconButton>
                  </Stack>
                  {
                    avatar.error && (
                      <Typography color={"error"} variant='caption' display={'block'} m={"1rem auto"} width={'fit-content'}>
                        {avatar.error}
                      </Typography>
                    )
                  }
                  <TextField required fullWidth label="Name" margin='normal' variant='outlined' value={name.value} onChange={name.changeHandler} />
                  <TextField required fullWidth label="Bio" margin='normal' variant='outlined' value={bio.value} onChange={bio.changeHandler} />
                  <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />
                  {
                    username.error && (
                      <Typography color={"error"} variant='caption'>
                        {username.error}
                      </Typography>
                    )
                  }
                  <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler} />
                  <Button
                    sx={{
                      marginTop: "1rem"
                    }}
                    variant='contained'
                    color='primary'
                    type='submit'
                    fullWidth
                    disabled={isLoading}
                  >
                    Sign Up
                  </Button>
                  <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
                  <Button

                    variant='text'
                    fullWidth
                    onClick={toggleLogin}
                    disabled={isLoading}
                  >
                    Login Instead
                  </Button>
                </form>
              </>
            )
        }
      </Paper>
    </Container>
  )
}

export default Login
