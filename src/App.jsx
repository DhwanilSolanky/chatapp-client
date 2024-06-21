import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectRoute from './components/auth/ProtectRoute';
import { server } from './constants/config';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from './socket';


const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsersManagement = lazy(() => import("./pages/admin/UserManagement"));
const AdminChatsManagement = lazy(() => import("./pages/admin/ChatManagement"));
const AdminMessagesManagement = lazy(() => import("./pages/admin/MessageManagement"));



const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      
      await axios.get(`http://localhost:3000/api/v1/user/myProfile`, { withCredentials: true }).then(({ data }) => dispatch(userExists(data.user))).catch((err) => dispatch(userNotExists()));
    };
    fetchUser();
  }, []);
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>
          }>
            <Route path='/' element={<Home />}></Route>
            <Route path='/chat/:chatId' element={<Chat />}></Route>
            <Route path='/groups' element={<Groups />}></Route>
          </Route>
          <Route path='/login' element={<ProtectRoute user={!user} redirect='/'><Login /></ProtectRoute>}></Route>
          <Route path='/admin' element={<AdminLogin />}></Route>
          <Route path='/admin/dashboard' element={<AdminDashboard />}></Route>
          <Route path='/admin/users-management' element={<AdminUsersManagement />}></Route>
          <Route path='/admin/chats-management' element={<AdminChatsManagement />}></Route>
          <Route path='/admin/messages' element={<AdminMessagesManagement />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </Suspense>
      <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App
