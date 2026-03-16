import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    Timeline as TimelineIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/context/AuthContext';

const DRAWER_WIDTH = 240;

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        logout();
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    // Define menu items based on user role
    const getMenuItems = () => {
        if (user?.role === 'superadmin') {
            return [
                {
                    text: 'Admins',
                    icon: <PeopleIcon />,
                    path: '/admins'
                }
            ];
        } else if (user?.role === 'admin') {
            return [
                {
                    text: 'Users',
                    icon: <PersonAddIcon />,
                    path: '/users'
                },
                {
                    text: 'User Activity',
                    icon: <TimelineIcon />,
                    path: '/user-activity'
                }
            ];
        }
        return [];
    };

    const menuItems = getMenuItems();

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: user?.role === 'superadmin' ? '#38BDF8' : '#2563EB' }}>
                    {user?.role === 'superadmin' ? 'SuperAdmin' : 'Admin'}
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: '#E5E7EB' }} />
            <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={location.pathname.startsWith(item.path)}
                            onClick={() => handleNavigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&.Mui-selected': {
                                    backgroundColor: user?.role === 'superadmin' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                                    '&:hover': {
                                        backgroundColor: user?.role === 'superadmin' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                                    }
                                },
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname.startsWith(item.path) ? (user?.role === 'superadmin' ? '#38BDF8' : '#2563EB') : '#6B7280', minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontWeight: location.pathname.startsWith(item.path) ? 600 : 500, color: location.pathname.startsWith(item.path) ? '#1F2937' : '#4B5563' } }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ borderColor: '#E5E7EB' }} />
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: user?.role === 'superadmin' ? '#38BDF8' : '#2563EB' }}>
                        {user?.firstName?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }} noWrap>
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }} noWrap>
                            {user?.role}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    background: '#FFFFFF',
                    borderBottom: '1px solid #E5E7EB'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: user?.role === 'superadmin' ? '#38BDF8' : '#2563EB', color: '#FFF' }}>
                                {user?.firstName?.charAt(0)}
                            </Avatar>
                        </IconButton>
                    </Box>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                background: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                minWidth: 200
                            }
                        }}
                    >
                        <MenuItem disabled>
                            <ListItemIcon>
                                <AccountCircleIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="body2">{user?.username}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.role}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: DRAWER_WIDTH,
                            background: '#FFFFFF',
                            borderRight: '1px solid #E5E7EB'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: DRAWER_WIDTH,
                            background: '#FFFFFF',
                            borderRight: '1px solid #E5E7EB'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    mt: 8
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
