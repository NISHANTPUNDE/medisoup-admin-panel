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
    RiPhoneLine,
    RiSmartphoneLine,
} from 'react-icons/ri';
import { useAuth } from '../../auth/context/AuthContext';

const DRAWER_WIDTH = 248;

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
    const accentColor = isSuperAdmin ? '#0EA5E9' : '#2563EB';
    const accentBg = isSuperAdmin ? 'rgba(14,165,233,0.1)' : 'rgba(37,99,235,0.1)';
    const accentBgHover = isSuperAdmin ? 'rgba(14,165,233,0.15)' : 'rgba(37,99,235,0.15)';

    const getMenuItems = () => {
        if (isSuperAdmin) {
            return [
                { text: 'Admin Management', icon: <RiGroupLine size={18} />, path: '/admins' },
            ];
        } else {
            return [
                { text: 'User Management', icon: <RiGroupLine size={18} />, path: '/users' },
                { text: 'User Activity', icon: <RiHistoryLine size={18} />, path: '/user-activity' },
                { text: 'Devices & Calls', icon: <RiSmartphoneLine size={18} />, path: '/users/devices' },
            ];
        }
    };

    const menuItems = getMenuItems();

    // Get page title from route
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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Brand Header */}
            <Box sx={{
                py: 3, px: 3, display: 'flex', alignItems: 'center', gap: 1.5,
                borderBottom: '1px solid #E5E7EB',
            }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: `linear-gradient(135deg, ${accentColor}, ${isSuperAdmin ? '#0284C7' : '#1D4ED8'})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <RiPhoneLine color="#fff" size={18} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1F2937', lineHeight: 1.2 }}>
                        Let's Connect
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: accentColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isSuperAdmin ? 'SuperAdmin' : 'Admin'}
                    </Typography>
                </Box>
            </Box>

            {/* Nav Items */}
            <List sx={{ flexGrow: 1, px: 2, pt: 2, pb: 1 }}>
                <Typography sx={{ px: 1, mb: 1.5, fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                                    borderRadius: '10px',
                                    py: 1.1,
                                    px: 1.5,
                                    transition: 'all 0.15s',
                                    position: 'relative',
                                    '&.Mui-selected': {
                                        backgroundColor: accentBg,
                                        '&:hover': { backgroundColor: accentBgHover },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0, top: '20%', bottom: '20%',
                                            width: 3, borderRadius: '0 2px 2px 0',
                                            background: accentColor,
                                        },
                                    },
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                }}
                            >
                                <Box sx={{
                                    mr: 1.5, color: isActive ? accentColor : '#6B7280',
                                    display: 'flex', alignItems: 'center',
                                    transition: 'color 0.15s',
                                }}>
                                    {item.icon}
                                </Box>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontSize: '0.875rem',
                                            fontWeight: isActive ? 600 : 500,
                                            color: isActive ? '#1F2937' : '#4B5563',
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* User Footer */}
            <Box sx={{ borderTop: '1px solid #E5E7EB', p: 2 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: 1.5, borderRadius: '10px', background: '#F8FAFC',
                }}>
                    <Avatar sx={{
                        width: 36, height: 36, fontSize: '0.875rem', fontWeight: 700,
                        background: `linear-gradient(135deg, ${accentColor}, ${isSuperAdmin ? '#0284C7' : '#1D4ED8'})`,
                    }}>
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || '?'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2937' }} noWrap>
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF' }} noWrap>
                            @{user?.username}
                        </Typography>
                    </Box>
                    <Tooltip title="Logout">
                        <IconButton size="small" onClick={handleLogout} sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}>
                            <RiLogoutBoxLine size={16} />
                        </IconButton>
                    </Tooltip>
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
                    borderBottom: '1px solid #E5E7EB',
                }}
            >
                <Toolbar sx={{ minHeight: '60px !important' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <RiMenuLine />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" noWrap sx={{ fontSize: '1rem', fontWeight: 700, color: '#1F2937' }}>
                            {getPageTitle()}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center', gap: 0.75,
                            px: 1.5, py: 0.5, borderRadius: '6px',
                            background: isSuperAdmin ? 'rgba(14,165,233,0.08)' : 'rgba(37,99,235,0.08)',
                        }}>
                            <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />
                            <Typography sx={{ fontSize: '0.75rem', color: accentColor, fontWeight: 600 }}>
                                {isSuperAdmin ? 'SuperAdmin' : 'Admin'}
                            </Typography>
                        </Box>

                        <Tooltip title={`${user?.firstName} ${user?.lastName} • ${user?.role}`}>
                            <IconButton onClick={handleProfileMenuOpen} size="small">
                                <Avatar sx={{
                                    width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700,
                                    background: `linear-gradient(135deg, ${accentColor}, ${isSuperAdmin ? '#0284C7' : '#1D4ED8'})`,
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
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                minWidth: 200,
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography sx={{ fontWeight: 600, color: '#1F2937', fontSize: '0.875rem' }}>
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                @{user?.username} · {user?.role}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: '#EF4444', '&:hover': { background: 'rgba(239,68,68,0.05)' } }}>
                            <RiLogoutBoxLine size={16} />
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
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
                            background: '#FFFFFF', borderRight: '1px solid #E5E7EB'
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
                            background: '#FFFFFF', borderRight: '1px solid #E5E7EB'
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
                    mt: '60px',
                    background: '#F8FAFC',
                    minHeight: 'calc(100vh - 60px)',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
