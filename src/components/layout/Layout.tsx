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
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery,
    Tooltip,
} from '@mui/material';
import {
    RiMenuLine,
    RiGroupLine,
    RiHistoryLine,
    RiLogoutBoxLine,
    RiPhoneLine
} from 'react-icons/ri';
import { useAuth } from '../../auth/context/AuthContext';

const DRAWER_WIDTH = 260;

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleProfileMenuClose();
        logout();
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const isSuperAdmin = user?.role === 'superadmin';

    const getMenuItems = () => {
        if (isSuperAdmin) {
            return [
                { text: 'Admin Management', icon: <RiGroupLine size={20} />, path: '/admins' },
            ];
        } else {
            return [
                { text: 'User Management', icon: <RiGroupLine size={20} />, path: '/users' },
                { text: 'User Activity', icon: <RiHistoryLine size={20} />, path: '/user-activity' },
            ];
        }
    };

    const menuItems = getMenuItems();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/admins')) return 'Admin Management';
        if (path === '/users') return 'User Management';
        if (path === '/user-activity') return 'User Activity';
        if (path.startsWith('/users/devices')) return 'Devices & Calls';
        if (path.startsWith('/users')) return 'User Details';
        return 'Dashboard';
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111b21' }}>
            {/* Brand Header — WhatsApp dark teal */}
            <Box sx={{
                py: 2.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1.5,
                background: '#202c33',
            }}>
                <Box sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#00a884',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <RiPhoneLine color="#fff" size={20} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#e9edef', lineHeight: 1.2 }}>
                        Let's Connect
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#00a884', fontWeight: 500, letterSpacing: '0.02em' }}>
                        {isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
                    </Typography>
                </Box>
            </Box>

            {/* Nav Items */}
            <List sx={{ flexGrow: 1, px: 1.5, pt: 2, pb: 1 }}>
                <Typography sx={{ px: 1.5, mb: 1.5, fontSize: '0.7rem', fontWeight: 600, color: '#8696a0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Navigation
                </Typography>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    borderRadius: '8px',
                                    py: 1.2,
                                    px: 1.5,
                                    transition: 'all 0.15s',
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(0,168,132,0.15)',
                                        '&:hover': { backgroundColor: 'rgba(0,168,132,0.2)' },
                                    },
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                                }}
                            >
                                <Box sx={{
                                    mr: 1.5, color: isActive ? '#00a884' : '#8696a0',
                                    display: 'flex', alignItems: 'center',
                                    transition: 'color 0.15s',
                                }}>
                                    {item.icon}
                                </Box>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? 500 : 400,
                                            color: isActive ? '#e9edef' : '#8696a0',
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* User Footer */}
            <Box sx={{ borderTop: '1px solid #2a3942', p: 2 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: 1.5, borderRadius: '8px', background: 'rgba(255,255,255,0.04)',
                }}>
                    <Avatar sx={{
                        width: 38, height: 38, fontSize: '0.9rem', fontWeight: 600,
                        background: '#00a884',
                    }}>
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || '?'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#e9edef' }} noWrap>
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#8696a0' }} noWrap>
                            @{user?.username}
                        </Typography>
                    </Box>
                    <Tooltip title="Logout">
                        <IconButton size="small" onClick={handleLogout} sx={{ color: '#8696a0', '&:hover': { color: '#EA0038', background: 'rgba(234,0,56,0.1)' } }}>
                            <RiLogoutBoxLine size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar — WhatsApp teal header */}
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    background: '#008069',
                    borderBottom: 'none',
                }}
            >
                <Toolbar sx={{ minHeight: '56px !important' }}>
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' }, color: '#fff' }}
                    >
                        <RiMenuLine />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" noWrap sx={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                            {getPageTitle()}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center', gap: 0.75,
                            px: 1.5, py: 0.5, borderRadius: '16px',
                            background: 'rgba(255,255,255,0.15)',
                        }}>
                            <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#25D366', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#fff', fontWeight: 500 }}>
                                {isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </Typography>
                        </Box>

                        <Tooltip title={`${user?.firstName} ${user?.lastName}`}>
                            <IconButton onClick={handleProfileMenuOpen} size="small">
                                <Avatar sx={{
                                    width: 34, height: 34, fontSize: '0.85rem', fontWeight: 600,
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                }}>
                                    {user?.firstName?.charAt(0) || '?'}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
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
                                mt: 1, background: '#FFFFFF',
                                border: '1px solid #e9edef',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                minWidth: 200, borderRadius: '8px',
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography sx={{ fontWeight: 600, color: '#111b21', fontSize: '0.875rem' }}>
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#667781' }}>
                                @{user?.username} · {user?.role}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: '#EA0038', '&:hover': { background: 'rgba(234,0,56,0.05)' } }}>
                            <RiLogoutBoxLine size={16} />
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer — dark sidebar */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box', width: DRAWER_WIDTH,
                            background: '#111b21', borderRight: 'none'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box', width: DRAWER_WIDTH,
                            background: '#111b21', borderRight: 'none'
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
                    mt: '56px',
                    background: '#f0f2f5',
                    minHeight: 'calc(100vh - 56px)',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
