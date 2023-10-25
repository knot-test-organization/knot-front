import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { ReactComponent as NttdataIcon } from '../assets/images/nttdatalogo.svg';
import logo from '../assets/icons/logo.png';
import Container from '@mui/material/Container';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import { indigo } from '@mui/material/colors';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import SvgIcon from '@mui/icons-material/AccountCircle';

export function LoginHeader() {
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
            <AccountCircleIcon sx={{ color: indigo[300], display: 'flex', ml: 1, fontSize: 50 }} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
