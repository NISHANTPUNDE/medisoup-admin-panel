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
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Add as AddIcon
} from '@mui/icons-material';

const AdminList: React.FC = () => {
    const navigate = useNavigate();
    const [actions, state] = useAdmin();
    const { getAdminList, deleteAdmin, toggleAdminStatus } = actions;
    const { admin_list, totalCount } = state;
    
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

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

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleCreate = () => {
        navigate('/admins/create/new');
    };

    const handleView = (id: string) => {
        navigate(`/admins/view/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/admins/edit/${id}`);
    };

    const handleDeleteClick = (id: string) => {
        setSelectedAdminId(id);
        setDeleteDialogOpen(true);
    };

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

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Admin Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                >
                    Create Admin
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Search by name, email, username, or phone"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                />
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : admin_list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No admins found
                                </TableCell>
                            </TableRow>
                        ) : (
                            admin_list.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell>{admin.username}</TableCell>
                                    <TableCell>{`${admin.firstName} ${admin.lastName}`}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>{admin.phone}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Switch
                                                checked={admin.isActive}
                                                onChange={() => handleToggleStatus(admin.id)}
                                                color="primary"
                                            />
                                            <Chip
                                                label={admin.isActive ? 'Active' : 'Inactive'}
                                                color={admin.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="info"
                                            onClick={() => handleView(admin.id)}
                                            title="View"
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(admin.id)}
                                            title="Edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(admin.id)}
                                            title="Delete"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this admin? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminList;
