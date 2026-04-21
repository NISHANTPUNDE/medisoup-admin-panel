import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../stores/Hooks';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    IconButton,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    CircularProgress,
    Typography,
    Chip,
    Avatar,
    InputAdornment,
    Tooltip,
} from '@mui/material';
import {
    RiUserAddLine,
    RiEditLine,
    RiDeleteBinLine,
    RiEyeLine,
    RiSearchLine,
    RiGroupLine,
    RiWifiLine,
    RiWifiOffLine,
    RiEyeOffLine,
    RiKeyLine,
    RiLockLine,
    RiLockUnlockLine,
    RiSmartphoneLine,
} from 'react-icons/ri';
import { useAuth } from '../../../auth/context/AuthContext';
import { DEFAULT_ADMIN_USER_LIMIT } from '../../../constants/admin';

const StatCard = ({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) => (
    <Paper sx={{
        p: 2.5, flex: 1, minWidth: 150,
        display: 'flex', alignItems: 'center', gap: 2,
        border: '1px solid #e9edef',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
    }}>
        <Box sx={{
            width: 44, height: 44, borderRadius: '12px',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
        }}>
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#667781', fontWeight: 500, mb: 0.3 }}>{label}</Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#111b21', lineHeight: 1 }}>{value}</Typography>
        </Box>
    </Paper>
);

// Password cell with show/hide toggle
const PasswordCell = ({ password }: { password?: string }) => {
    const [show, setShow] = useState(false);
    if (!password) return <Typography sx={{ fontSize: '0.875rem', color: '#D1D5DB' }}>—</Typography>;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.875rem', fontFamily: 'monospace', color: show ? '#111b21' : '#667781', letterSpacing: show ? 0 : 2 }}>
                {show ? password : '••••••••'}
            </Typography>
            <IconButton size="small" onClick={() => setShow(!show)} sx={{ p: 0.3 }}>
                {show ? <RiEyeOffLine size={14} style={{ color: '#9CA3AF' }} /> : <RiEyeLine size={14} style={{ color: '#9CA3AF' }} />}
            </IconButton>
        </Box>
    );
};

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [actions, state] = useUser();
    const { getUserList, deleteUser, toggleUserStatus, lockDevice, unlockDevice } = actions;
    const { user_list, totalCount } = state;
    const { user: adminUser } = useAuth() as any;

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [limitDialogOpen, setLimitDialogOpen] = useState(false);

    const userLimit = adminUser?.userLimit ?? DEFAULT_ADMIN_USER_LIMIT;

    useEffect(() => {
        loadUsers();
    }, [page, rowsPerPage, search]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            await getUserList(page + 1, rowsPerPage, search);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
    };

    // Check limit BEFORE navigating to form
    const handleCreate = () => {
        if (totalCount >= userLimit) {
            setLimitDialogOpen(true);
        } else {
            navigate('/users/create/new');
        }
    };

    const handleView = (id: string) => navigate(`/users/view/${id}`);
    const handleEdit = (id: string) => navigate(`/users/edit/${id}`);
    const handleDeleteClick = (id: string) => { setSelectedUserId(id); setDeleteDialogOpen(true); };
    const handleDeleteConfirm = async () => {
        if (selectedUserId) {
            try {
                await deleteUser(selectedUserId);
                setDeleteDialogOpen(false);
                setSelectedUserId(null);
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };
    const handleToggleStatus = async (id: string) => {
        try {
            await toggleUserStatus(id);
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const activeCount = user_list.filter(u => u.isActive).length;
    const inactiveCount = user_list.filter(u => !u.isActive).length;
    const avatarColors = ['#008069', '#00a884', '#8B5CF6', '#00a884', '#F59E0B', '#EF4444'];
    const isAtLimit = totalCount >= userLimit;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111b21' }}>User Management</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage users under your admin account
                        {userLimit && (
                            <Chip
                                label={`${totalCount} / ${userLimit} users`}
                                size="small"
                                sx={{
                                    ml: 1.5, fontWeight: 700, fontSize: '0.72rem',
                                    background: isAtLimit ? 'rgba(239,68,68,0.1)' : 'rgba(0,168,132,0.1)',
                                    color: isAtLimit ? '#DC2626' : '#008069',
                                    border: 'none',
                                }}
                            />
                        )}
                    </Typography>
                </Box>
                <Tooltip title={isAtLimit ? `User limit reached (${userLimit})` : 'Create new user'}>
                    <span>
                        <Button
                            variant="contained"
                            startIcon={<RiUserAddLine />}
                            onClick={handleCreate}
                            sx={{
                                background: isAtLimit
                                    ? 'linear-gradient(135deg, #9CA3AF, #667781)'
                                    : 'linear-gradient(135deg, #008069, #005c4b)',
                                boxShadow: isAtLimit ? 'none' : '0 4px 12px rgba(0,128,105,0.3)',
                                '&:hover': {
                                    background: isAtLimit
                                        ? 'linear-gradient(135deg, #667781, #4B5563)'
                                        : 'linear-gradient(135deg, #005c4b, #1E40AF)',
                                },
                            }}
                        >
                            {isAtLimit ? 'Limit Reached' : 'Create User'}
                        </Button>
                    </span>
                </Tooltip>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <StatCard label="Total Users" value={totalCount} icon={<RiGroupLine size={20} />} color="#008069" />
                <StatCard label="Active" value={activeCount} icon={<RiWifiLine size={20} />} color="#00a884" />
                <StatCard label="Inactive" value={inactiveCount} icon={<RiWifiOffLine size={20} />} color="#F59E0B" />
                <StatCard label="Limit" value={`${totalCount}/${userLimit}`} icon={<RiGroupLine size={20} />} color={isAtLimit ? '#EF4444' : '#8B5CF6'} />
            </Box>

            {/* Search */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search by name, username, or phone..."
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <RiSearchLine style={{ color: '#9CA3AF' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><RiKeyLine size={14} /> Password</Box></TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Device Lock</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : user_list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <RiGroupLine style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 8 }} />
                                    <Typography color="text.secondary">No users found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            user_list.map((user, idx) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{
                                                width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                                                background: `linear-gradient(135deg, ${avatarColors[idx % avatarColors.length]}, ${avatarColors[(idx + 1) % avatarColors.length]})`,
                                            }}>
                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111b21' }}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#667781' }}>
                                                    @{user.username}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.875rem', color: '#667781' }}>
                                            {user.phone || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <PasswordCell password={user.plainPassword} />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Switch
                                                checked={user.isActive}
                                                onChange={() => handleToggleStatus(user.id)}
                                                size="small"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#00a884' },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: '#00a884' },
                                                }}
                                            />
                                            <Chip
                                                label={user.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600, fontSize: '0.7rem',
                                                    background: user.isActive ? 'rgba(0,168,132,0.1)' : 'rgba(107,114,128,0.1)',
                                                    color: user.isActive ? '#008069' : '#667781',
                                                    border: 'none',
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Tooltip title={user.lockedDeviceId ? 'Click to unlock device' : 'Click to lock device'}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => user.lockedDeviceId ? unlockDevice(user.id) : lockDevice(user.id)}
                                                    sx={{
                                                        color: user.lockedDeviceId ? '#DC2626' : '#00a884',
                                                        background: user.lockedDeviceId ? 'rgba(220,38,38,0.08)' : 'rgba(0,168,132,0.08)',
                                                        '&:hover': {
                                                            background: user.lockedDeviceId ? 'rgba(220,38,38,0.15)' : 'rgba(0,168,132,0.15)',
                                                        },
                                                    }}
                                                >
                                                    {user.lockedDeviceId ? <RiLockLine size={16} /> : <RiLockUnlockLine size={16} />}
                                                </IconButton>
                                            </Tooltip>
                                            <Chip
                                                icon={<RiSmartphoneLine size={12} />}
                                                label={user.lockedDeviceId ? 'Locked' : 'Unlocked'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600, fontSize: '0.7rem',
                                                    background: user.lockedDeviceId ? 'rgba(220,38,38,0.1)' : 'rgba(0,168,132,0.1)',
                                                    color: user.lockedDeviceId ? '#DC2626' : '#008069',
                                                    border: 'none',
                                                    '& .MuiChip-icon': { color: 'inherit' },
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                            <Tooltip title="View">
                                                <IconButton size="small" onClick={() => handleView(user.id)} sx={{ color: '#00a884', '&:hover': { background: 'rgba(0,168,132,0.1)' } }}>
                                                    <RiEyeLine size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleEdit(user.id)} sx={{ color: '#008069', '&:hover': { background: 'rgba(0,128,105,0.1)' } }}>
                                                    <RiEditLine size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={() => handleDeleteClick(user.id)} sx={{ color: '#EF4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}>
                                                    <RiDeleteBinLine size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* User Limit Reached Dialog */}
            <Dialog open={limitDialogOpen} onClose={() => setLimitDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: 400 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                    🚫 User Limit Reached
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '0.9rem' }}>
                        You have reached your maximum limit of <strong>{userLimit} users</strong>.
                        Please contact the Super Admin to increase your user limit.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setLimitDialogOpen(false)} variant="contained"
                        sx={{ borderRadius: '8px', background: '#008069', '&:hover': { background: '#005c4b' } }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: 420 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RiDeleteBinLine size={20} />
                    Delete User Permanently
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '0.9rem' }}>
                        This will <strong>permanently delete</strong> the user account and all associated data including call history.
                    </DialogContentText>
                    <Box sx={{ mt: 2, p: 1.5, background: 'rgba(239,68,68,0.06)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#B91C1C', fontWeight: 600 }}>
                            ⚠️ This action cannot be undone.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" sx={{ borderRadius: '8px' }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained"
                        sx={{ borderRadius: '8px', background: '#DC2626', '&:hover': { background: '#B91C1C' } }}>
                        Delete Permanently
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserList;
