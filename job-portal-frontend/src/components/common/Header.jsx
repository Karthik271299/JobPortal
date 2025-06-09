import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const menuItems = [
    { label: 'Home', path: '/' },
    ...(isAuthenticated ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
    ...(!isAuthenticated
      ? [
          { label: 'Login', path: '/login' },
          { label: 'Register', path: '/register', isButton: true },
        ]
      : []),
  ];

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

return (
    <>
      <AppBar position="sticky" color="default" elevation={2}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}
          >
            JobPortal
          </Typography>

          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250, paddingTop: 2 }}>
                  <List>
                    {menuItems.map((item, i) => (
                      <ListItem button component={Link} to={item.path} key={i} onClick={() => setDrawerOpen(false)}>
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                    {isAuthenticated && (
                      <>
                        <Divider />
                        <ListItem>
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            Welcome, <strong>{user?.firstName}</strong>
                          </Typography>
                          <Button onClick={handleLogout} color="error" size="small">
                            Logout
                          </Button>
                        </ListItem>
                      </>
                    )}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {menuItems.map((item, i) =>
                item.isButton ? (
                  <Button
                    key={i}
                    component={Link}
                    to={item.path}
                    variant="contained"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={i}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                  >
                    {item.label}
                  </Button>
                )
              )}

              {isAuthenticated && (
                <>
                  <IconButton onClick={handleMenuOpen} color="inherit">
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2">
                        Welcome, <strong>{user?.firstName}</strong>
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
