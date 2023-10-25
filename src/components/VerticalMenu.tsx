import * as React from 'react';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import CloudIcon from '@mui/icons-material/Cloud';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ClassIcon from '@mui/icons-material/Class';
import BusinessIcon from '@mui/icons-material/Business';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BuildIcon from '@mui/icons-material/Build';
import { Link } from 'react-router-dom';

const drawerWidth = 230;

const menuItems: MenuItem[] = [
  {
    text: 'Home',
    icon: <HomeIcon fontSize="small" />,
    subItems: [],
    route: '/',
  },
  {
    text: 'Products',
    icon: <CloudIcon fontSize="small" />,
    subItems: [
      { text: 'Create Product', icon: <AddBoxIcon fontSize="small" />, route: '/newproduct' },
    ],
    route: '/',
  },
  {
    text: 'Configuration',
    icon: <SettingsIcon fontSize="small" />,
    subItems: [
      { text: 'Config', icon: <BuildIcon fontSize="small" />, route: '/admin' },
      { text: 'Catalog', icon: <ClassIcon fontSize="small" />, route: '/admin/catalog' },
      { text: 'Organizations', icon: <BusinessIcon fontSize="small" />, route: '/admin/organization' },
    ],
    route: '',
  },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)})`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)})`,
  },
});

interface MenuItem {
  text: string;
  icon: JSX.Element | null;
  subItems: SubMenuItem[];
  route: string;
}

interface SubMenuItem {
  text: string;
  icon: JSX.Element | null;
  route: string;
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  marginTop: theme.spacing(-0.9),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const toggleDrawer = () => {
    setOpen(!open);
    if (!open) {
      setSelectedIndex(null);
    }
  };

  const handleMenuItemClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} >
        <DrawerHeader>
          <IconButton sx={{ marginTop: '0.28em', marginRight: '-0.05em'}} onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <div key={item.text}>
              {item.subItems.length > 0 ? (
                <>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2.5,
                    }}
                  >
                    <Link to={item.route} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                      <ListItemIcon sx={{ marginLeft: -0.3, color: '#6486c2' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', ml: -2}} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                    <IconButton
                      onClick={() => handleMenuItemClick(index)}
                      sx={{ marginLeft: 'auto' }}
                    >
                      {selectedIndex === index ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </IconButton>
                  </ListItemButton>
                  <div
                    style={{
                      display: selectedIndex === index && open ? 'block' : 'none',
                      marginLeft: '20px',
                    }}
                  >
                    <List>
                      {item.subItems.map((subItem) => (
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: 'flex-start',
                            px: 2.5,
                          }}
                          href={subItem.route}
                          key={subItem.text}
                        >
                          <ListItemIcon sx={{ marginLeft: -0.3, color: '#6486c2' }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.text} primaryTypographyProps={{fontSize: '0.9rem'}} sx={{ opacity: open ? 1 : 0, marginLeft: -2 }} />
                        </ListItemButton>
                      ))}
                    </List>
                  </div>
                </>
              ) : (
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2.5,
                  }}
                  href={item.route}
                >
                  <Link to={item.route} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon sx={{ marginLeft: -0.3, color: '#6486c2' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', ml: -2}} sx={{ opacity: open ? 1 : 0 }} />
                  </Link>
                  <IconButton
                    onClick={() => handleMenuItemClick(index)}
                    sx={{ marginLeft: 'auto'}}
                  >
                    {selectedIndex === index ? <ArrowDropUpIcon /> : null}
                  </IconButton>
                </ListItemButton>
              )}
            </div>
          ))}
        </List>
      </Drawer>
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        onClick={toggleDrawer}
        edge="start"
        sx={{
          position: 'fixed',
          top: theme.spacing(2),
          left: theme.spacing(2),
        }}
      >
        {open ? <MenuIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
}
