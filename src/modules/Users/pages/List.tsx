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
    RiPhoneLine,
    RiLockLine,
    RiLockUnlockLine,
} from 'react-icons/ri';

const StatCard = ({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) => (
    <Paper sx={{
        p: 2.5, flex: 1, minWidth: 150,
        display: 'flex', alignItems: 'center', gap: 2,
        border: '1px solid #E5E7EB',
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
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500, mb: 0.3 }}>{label}</Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937', lineHeight: 1 }}>{value}</Typography>
        </Box>
    </Paper>
);

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [actions, state] = useUser();
    const { getUserList, deleteUser, toggleUserStatus, unlockDevice } = actions;
    const { user_list, totalCount } = state;

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [unlockingId, setUnlockingId] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, [page, rowsPerPage, search]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const currentPage = page + 1;
            await getUserList(currentPage, rowsPerPage, search);
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
    const handleCreate = () => navigate('/users/create/new');
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

    const handleUnlockDevice = async (id: string) => {
        try {
            setUnlockingId(id);
            await unlockDevice(id);
        } catch (error) {
            console.error('Error unlocking device:', error);
        } finally {
            setUnlockingId(null);
        }
    };

    const activeCount = user_list.filter(u => u.isActive).length;
    const inactiveCount = user_list.filter(u => !u.isActive).length;

    // Avatar color palette
    const avatarColors = ['#2563EB', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>User Management</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage users under your admin account
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<RiUserAddLine />}
                    onClick={handleCreate}
                    sx={{
                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)', boxShadow: '0 6px 16px rgba(37,99,235,0.4)' },
                    }}
                >
                    Create User
                </Button>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <StatCard label="Total Users" value={totalCount} icon={<RiGroupLine size={20} />} color="#2563EB" />
                <StatCard label="Active" value={activeCount} icon={<RiWifiLine size={20} />} color="#10B981" />
                <StatCard label="Inactive" value={inactiveCount} icon={<RiWifiOffLine size={20} />} color="#F59E0B" />
                <StatCard label="Showing" value={user_list.length} icon={<RiPhoneLine size={20} />} color="#8B5CF6" />
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
                            <TableCell>Address</TableCell>
                            <TableCell>Device</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : user_list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
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
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1F2937' }}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                    @{user.username}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                            {user.phone || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {user.address || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {user.lockedDeviceId ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Chip
                                                    icon={<RiLockLine size={12} />}
                                                    label="Locked"
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700, fontSize: '0.7rem',
                                                        background: 'rgba(239,68,68,0.1)',
                                                        color: '#DC2626', border: 'none',
                                                    }}
                                                />
                                                <Tooltip title="Unlock Device">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleUnlockDevice(user.id)}
                                                        disabled={unlockingId === user.id}
                                                        sx={{ color: '#10B981', '&:hover': { background: 'rgba(16,185,129,0.1)' } }}
                                                    >
                                                        {unlockingId === user.id
                                                            ? <CircularProgress size={14} />
                                                            : <RiLockUnlockLine size={14} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        ) : (
                                            <Chip
                                                icon={<RiLockUnlockLine size={12} />}
                                                label="Free"
                                                size="small"
                                                sx={{
                                                    fontWeight: 600, fontSize: '0.7rem',
                                                    background: 'rgba(16,185,129,0.1)',
                                                    color: '#059669', border: 'none',
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Switch
                                                checked={user.isActive}
                                                onChange={() => handleToggleStatus(user.id)}
                                                size="small"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#10B981' },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: '#10B981' },
                                                }}
                                            />
                                            <Chip
                                                label={user.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600, fontSize: '0.7rem',
                                                    background: user.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                                                    color: user.isActive ? '#059669' : '#6B7280',
                                                    border: 'none',
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                            <Tooltip title="View">
                                                <IconButton size="small" onClick={() => handleView(user.id)} sx={{ color: '#0EA5E9', '&:hover': { background: 'rgba(14,165,233,0.1)' } }}>
                                                    <RiEyeLine size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleEdit(user.id)} sx={{ color: '#2563EB', '&:hover': { background: 'rgba(37,99,235,0.1)' } }}>
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

            {/* Delete Dialog — Permanent */}
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
