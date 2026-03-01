import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
} from '@mui/material';
import { Refresh, Logout, Phone, PersonOff } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL || 'https://call.deveraa.com/call';

interface Session {
    userId: string;
    name: string;
    inCall: boolean;
    roomId: string | null;
    deviceSessionId: string | null;
}

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [logoutDialog, setLogoutDialog] = useState<{ open: boolean; session: Session | null }>({
        open: false,
        session: null,
    });
    const [logoutReason, setLogoutReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchSessions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/admin/sessions`);
            const data = await response.json();
            if (data.success) {
                setSessions(data.data.sessions);
            } else {
                setError(data.message || 'Failed to fetch sessions');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchSessions, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleLogoutClick = (session: Session) => {
        setLogoutDialog({ open: true, session });
        setLogoutReason('');
    };

    const handleLogoutConfirm = async () => {
        if (!logoutDialog.session) return;
        
        setActionLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/admin/sessions/${logoutDialog.session.userId}/logout`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason: logoutReason || 'Logged out by administrator' }),
                }
            );
            const data = await response.json();
            if (data.success) {
                fetchSessions();
            } else {
                setError(data.message || 'Failed to logout user');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setActionLoading(false);
            setLogoutDialog({ open: false, session: null });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Active Sessions</Typography>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchSessions}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>User Name</TableCell>
                                <TableCell>User ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Session ID</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : sessions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <PersonOff sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                        <Typography color="text.secondary">No active sessions</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sessions.map((session) => (
                                    <TableRow key={session.userId} hover>
                                        <TableCell>
                                            <Typography fontWeight="medium">{session.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                                {session.userId.substring(0, 8)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {session.inCall ? (
                                                <Chip
                                                    icon={<Phone />}
                                                    label={`In Call (${session.roomId})`}
                                                    color="success"
                                                    size="small"
                                                />
                                            ) : (
                                                <Chip label="Online" color="primary" size="small" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                                {session.deviceSessionId?.substring(0, 8)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<Logout />}
                                                onClick={() => handleLogoutClick(session)}
                                            >
                                                Force Logout
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialog.open} onClose={() => setLogoutDialog({ open: false, session: null })}>
                <DialogTitle>Force Logout User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to force logout <strong>{logoutDialog.session?.name}</strong>?
                        This will immediately disconnect them and require re-authentication.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason (optional)"
                        fullWidth
                        variant="outlined"
                        value={logoutReason}
                        onChange={(e) => setLogoutReason(e.target.value)}
                        placeholder="e.g., Security concern, Account reset"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialog({ open: false, session: null })}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogoutConfirm}
                        color="error"
                        variant="contained"
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={20} /> : 'Force Logout'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
