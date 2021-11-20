import React, { useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';
import useRouter from '../Hooks/useRouter'
import { useAuth } from '../Hooks/useAuth'
import MenuIcon from '@mui/icons-material/Menu';
import { toast } from 'react-toastify';
import { currentUserAtom } from '../store/user';
import Navbar from './Navbar';


const Header = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const Logout = () => {
    setCurrentUser(null)
    logout()
    toast.info('Disconnected!', {
      position: "top-left",
      theme: "dark",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    router.history.push('/sign')
  }
  return (
      <AppBar sx={{ backgroundColor: 'white'}} position="fixed">
        <Toolbar>
          <Typography variant="a" component="div" sx={{ flexGrow: 1, color: 'black', cursor: 'pointer' }}>
              <IconButton
                edge="start"
                className=""
                color="inherit"
                aria-label="open navbar"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Navbar open={isDrawerOpen} toggleDrawerHandler={() => setDrawerOpen(false)} />
            </Typography>
              {
                currentUser && <div className="text-dark mx-auto" style={{cursor: 'pointer'}} onClick={Logout}>Logout</div>
              }
        </Toolbar>
      </AppBar>
  );
}

export default Header;