import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { ReactComponent as NttdataIcon } from '../assets/images/nttdatalogo.svg';
import logo from '../assets/icons/logo.png';
import Container from '@mui/material/Container';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import { indigo } from '@mui/material/colors';
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import SvgIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

export function Header() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const clientId = '9d5b3500c699be3762b0';
  const clientSecret = 'ca7ec04eefbbd3e4a37b4fd31a549a09b78431fd';

  const logout = async () => {
    Cookies.remove('access_token');
    Cookies.remove('user');
    window.location.href = 'http://knot.westeurope.cloudapp.azure.com/login';
  };

  const openProfile = async () => {
    window.location.href = 'https://github.com/' + userData.login;
  };

  const menuItems = [
    {
      text: 'Profile',
      icon: <AccountCircleIcon />,
      onClick: openProfile,
    },
    {
      text: 'Logout',
      icon: <LogoutIcon />,
      onClick: logout,
    },
  ];

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const proxyUrl = 'http://knot.westeurope.cloudapp.azure.com/server/authenticate';
    const accessToken = Cookies.get('access_token');
    let user = Cookies.get('user');

    if (!accessToken) {
      if (code != null) {
        axios
          .post(proxyUrl, {
            code: code,
          },
          )
          .then((response) => {
            const data = response.data;

            Cookies.set('access_token', data.token, { expires: 365 });
            Cookies.set('user', JSON.stringify(data.user), { expires: 365 });
            user = data.user;
            document.getElementById('username').innerHTML = data.user.login.toUpperCase();
            window.location.href = 'http://knot.westeurope.cloudapp.azure.com/';
          })
          .catch((error) => {
            // Manejar errores de la solicitud de intercambio de código
            // window.location.href = 'http://knot.westeurope.cloudapp.azure.com/login';
            console.error('Error al intercambiar código de autorización:', error);
          });
      } else {
        window.location.href = 'http://knot.westeurope.cloudapp.azure.com/login';
      }
    }
    if (user) {
      const userDataObject = JSON.parse(user);
      setUserData(userDataObject);
    }
  }, [clientId, clientSecret, navigate]);

  return (
    <AppBar sx={{ height: '3.6em' }} position="static" color="transparent" variant="outlined">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: '2em' }}>
          <a href="/">
            <SvgIcon sx={{ width: '5em', mr: 2 }} component={NttdataIcon} inheritViewBox />
          </a>
          <Divider sx={{ 'mr': 1, 'border-width': '0.5px', 'border-color': 'rgba(103,135,193,1)', 'height': '2.5em' }} orientation="vertical" variant="middle" light flexItem />
          <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
            <a href="/">
              <img src={logo} style={{ width: '5em' }} />
            </a>
          </Box>
          <Divider sx={{ 'mr': 1, 'border-width': '0.5px', 'border-color': 'rgba(103,135,193,1)', 'height': '2.5em' }} orientation="vertical" variant="middle" light flexItem />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 1.5, mr: 0.7 }}>
              <Typography sx={{ 'font-size': '0.8rem', 'color': 'rgba(103,135,193,1)' }} textAlign="center" id="username">{userData ? userData.login.toUpperCase() : ''}</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <div>
                <Button
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={open ? 'composition-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  {userData ? (
                    <img
                      src={userData.avatar_url}
                      style={{
                        display: 'flex',
                        width: 37,
                        borderRadius: 20,
                        cursor: 'pointer',
                      }}
                      alt="Profile Icon"
                    />
                  ) : (
                    <AccountCircleIcon
                      sx={{ color: indigo[300], display: 'flex', ml: 1, fontSize: 50 }}
                    />
                  )}
                </Button>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                  style={{ zIndex: 99, borderRadius: '4px', width: '11rem' }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === 'bottom-start' ? 'left top' : 'left bottom',
                      }}
                    >
                      <Paper style={{ width: '10rem' }}>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                          >
                            {menuItems.map((item, index) => (
                              <React.Fragment key={index}>
                                <MenuItem onClick={item.onClick} sx={{ fontSize: '0.8rem' }}>
                                  {item.icon && (
                                    <IconButton size="small" sx={{ mr: 1, color: '#6486c2', boxShadow: 'none', pointerEvents: 'none' }}>
                                      {item.icon}
                                    </IconButton>
                                  )}
                                  {item.text}
                                </MenuItem>
                              </React.Fragment>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
