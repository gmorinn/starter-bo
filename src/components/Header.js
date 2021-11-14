import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';
import useRouter from '../Hooks/useRouter'
import { useAuth } from '../Hooks/useAuth'
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { toast } from 'react-toastify';
import { currentUserAtom } from '../store/user';


const Header = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)

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
          <Typography variant="a" component="div" sx={{ flexGrow: 1, color: 'black', cursor: 'pointer' }} onClick={() => router.history.push('/')}>
              <WhatshotIcon />
            </Typography>
              {
                currentUser && <div className="text-dark mx-auto" style={{cursor: 'pointer'}} onClick={Logout}>Logout</div>
              }
        </Toolbar>
      </AppBar>
  );
}

export default Header;