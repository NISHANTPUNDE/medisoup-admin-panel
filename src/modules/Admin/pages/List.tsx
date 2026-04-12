import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../stores/Hooks';
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
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiUserLine,
    RiEyeOffLine,
    RiKeyLine,
    RiLogoutBoxLine,
} from 'react-icons/ri';
import { useAuth } from '../../../auth/context/AuthContext';

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

// Password cell with show/hide toggle
const PasswordCell = ({ password }: { password?: string }) => {
    const [show, setShow] = useState(false);
    if (!password) return <Typography sx={{ fontSize: '0.875rem', color: '#D1D5DB' }}>—</Typography>;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.875rem', fontFamily: 'monospace', color: show ? '#1F2937' : '#6B7280', letterSpacing: show ? 0 : 2 }}>
                {show ? password : '••••••••'}
            </Typography>
            <IconButton size="small" onClick={() => setShow(!show)} sx={{ p: 0.3 }}>
                {show ? <RiEyeOffLine size={14} style={{ color: '#9CA3AF' }} /> : <RiEyeLine size={14} style={{ color: '#9CA3AF' }} />}
            </IconButton>
        </Box>
    );
};

const AdminList: React.FC = () => {
    const navigate = useNavigate();
    const [actions, state] = useAdmin();
    const { getAdminList, deleteAdmin, toggleAdminStatus } = actions;
    const { admin_list, totalCount } = state;
    const { logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    useEffect(() => {
        loadAdmins();
    }, [page, rowsPerPage, search]);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            await getAdminList(page + 1, rowsPerPage, search);
        } catch (error) {
            console.error('Error loading admins:', error);
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
    const handleCreate = () => navigate('/admins/create/new');
    const handleView = (id: string) => navigate(`/admins/view/${id}`);
    const handleEdit = (id: string) => navigate(`/admins/edit/${id}`);
    const handleDeleteClick = (id: string) => { setSelectedAdminId(id); setDeleteDialogOpen(true); };
    const handleDeleteConfirm = async () => {
        if (selectedAdminId) {
            try {
                await deleteAdmin(selectedAdminId);
                setDeleteDialogOpen(false);
                setSelectedAdminId(null);
            } catch (error) {
                console.error('Error deleting admin:', error);
            }
        }
    };
    const handleToggleStatus = async (id: string) => {
        try {
            await toggleAdminStatus(id);
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const activeCount = admin_list.filter(a => a.isActive).length;
    const inactiveCount = admin_list.filter(a => !a.isActive).length;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>Admin Management</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage all admin accounts and their permissions
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RiLogoutBoxLine />}
                        onClick={() => setLogoutDialogOpen(true)}
                        sx={{
                            borderColor: '#EF4444', color: '#EF4444',
                            '&:hover': { background: 'rgba(239,68,68,0.06)', borderColor: '#DC2626' },
                        }}
                    >
                        Logout
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<RiUserAddLine />}
                        onClick={handleCreate}
                        sx={{
                            background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                            boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                            '&:hover': { background: 'linear-gradient(135deg, #0284C7, #0369A1)', boxShadow: '0 6px 16px rgba(14,165,233,0.4)' },
                        }}
                    >
                        Create Admin
                    </Button>
                </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <StatCard label="Total Admins" value={totalCount} icon={<RiGroupLine size={20} />} color="#0EA5E9" />
                <StatCard label="Active" value={activeCount} icon={<RiCheckboxCircleLine size={20} />} color="#10B981" />
                <StatCard label="Inactive" value={inactiveCount} icon={<RiCloseCircleLine size={20} />} color="#F59E0B" />
                <StatCard label="Showing" value={admin_list.length} icon={<RiUserLine size={20} />} color="#8B5CF6" />
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
                            <TableCell>Admin</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><RiKeyLine size={14} /> Password</Box></TableCell>
                            <TableCell>User Limit</TableCell>
                            <TableCell>Status</TableCell>
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
                        ) : admin_list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <RiGroupLine style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 8 }} />
                                    <Typography color="text.secondary">No admins found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            admin_list.map((admin) => (
                                <TableRow key={admin.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{
                                                width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                                                background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                                            }}>
                                                {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1F2937' }}>
                                                    {admin.firstName} {admin.lastName}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                    @{admin.username}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                            {admin.phone || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <PasswordCell password={admin.plainPassword} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${admin.userLimit || 10} users`}
                                            size="small"
                                            sx={{ background: 'rgba(139,92,246,0.1)', color: '#7C3AED', fontWeight: 600, border: 'none' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Switch
                                                checked={admin.isActive}
                                                onChange={() => handleToggleStatus(admin.id)}
                                                size="small"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#10B981' },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: '#10B981' },
                                                }}
                                            />
                                            <Chip
                                                label={admin.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600, fontSize: '0.7rem',
                                                    background: admin.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                                                    color: admin.isActive ? '#059669' : '#6B7280',
                                                    border: 'none',
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                            <Tooltip title="View">
                                                <IconButton size="small" onClick={() => handleView(admin.id)} sx={{ color: '#0EA5E9', '&:hover': { background: 'rgba(14,165,233,0.1)' } }}>
                                                    <RiEyeLine size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleEdit(admin.id)} sx={{ color: '#2563EB', '&:hover': { background: 'rgba(37,99,235,0.1)' } }}>
                                                    <RiEditLine size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={() => handleDeleteClick(admin.id)} sx={{ color: '#EF4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}>
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

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: 380 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RiLogoutBoxLine size={20} color="#EF4444" />
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '0.9rem' }}>
                        Are you sure you want to logout from the Super Admin panel?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={() => setLogoutDialogOpen(false)} variant="outlined" sx={{ borderRadius: '8px' }}>Cancel</Button>
                    <Button onClick={logout} variant="contained"
                        sx={{ borderRadius: '8px', background: '#EF4444', '&:hover': { background: '#DC2626' } }}>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: 420 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RiDeleteBinLine size={20} />
                    Delete Admin Permanently
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '0.9rem' }}>
                        This will <strong>permanently delete</strong> the admin account and all associated data.
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

export default AdminList;
