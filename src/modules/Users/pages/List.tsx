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
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Add as AddIcon
} from '@mui/icons-material';

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [actions, state] = useUser();
    const { getUserList, deleteUser, toggleUserStatus } = actions;
    const { user_list, totalCount } = state;
    
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, [page, rowsPerPage, search]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const currentPage = page + 1; // Convert 0-indexed to 1-indexed
            await getUserList(currentPage, rowsPerPage, search);
        } catch (error) {
            console.error('Error loading users:', error);
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
        navigate('/users/create/new');
    };

    const handleView = (id: string) => {
        navigate(`/users/view/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDeleteClick = (id: string) => {
        setSelectedUserId(id);
        setDeleteDialogOpen(true);
    };

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

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">User Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                >
                    Create User
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
                            <TableCell>Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : user_list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            user_list.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                    <TableCell>{user.email || '-'}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.address || '-'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Switch
                                                checked={user.isActive}
                                                onChange={() => handleToggleStatus(user.id)}
                                                color="primary"
                                            />
                                            <Chip
                                                label={user.isActive ? 'Active' : 'Inactive'}
                                                color={user.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="info"
                                            onClick={() => handleView(user.id)}
                                            title="View"
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(user.id)}
                                            title="Edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(user.id)}
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
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user? This action cannot be undone.
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

export default UserList;
