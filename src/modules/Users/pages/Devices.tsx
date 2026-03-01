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
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
} from '@mui/material';
import {
    Phone,
    PhoneAndroid,
    History,
    Refresh,
    Person,
    Close,
} from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL || 'https://call.deveraa.com/call';

interface DeviceInfo {
    model?: string;
    os?: string;
    appVersion?: string;
    platform?: string;
}

interface DeviceSession {
    _id: string;
    deviceId: string;
    deviceInfo: DeviceInfo;
    isActive: boolean;
    loginAt: string;
    logoutAt?: string;
    lastActiveAt: string;
    ipAddress?: string;
}

interface CallHistoryItem {
    _id: string;
    callId: string;
    roomId: string;
    participants: string[];
    startTime: string;
    endTime?: string;
    duration?: number;
    callType: 'incoming' | 'outgoing';
    status: 'completed' | 'missed';
}

interface UserWithDevice {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    isActive: boolean;
    deviceInfo?: DeviceInfo;
    isOnline: boolean;
    lastActiveAt?: string;
    totalCalls: number;
    totalCallDuration: number;
    recentDevices: DeviceSession[];
}

interface UserDetails {
    user: UserWithDevice;
    deviceSessions: DeviceSession[];
    callHistory: CallHistoryItem[];
}

export default function UserDevices() {
    const [users, setUsers] = useState<UserWithDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    
    // TODO: Get from auth context
    const adminId = localStorage.getItem('adminId') || '';

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/admin/${adminId}/users?limit=100`);
            const data = await response.json();
            if (data.success) {
                setUsers(data.data.users);
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminId) fetchUsers();
    }, [adminId]);

    const fetchUserDetails = async (userId: string) => {
        setDetailsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/${adminId}/users/${userId}/details`);
            const data = await response.json();
            if (data.success) {
                setSelectedUser(data.data);
                setDetailsOpen(true);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '-';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">User Devices & Call History</Typography>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchUsers}
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Device</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Active</TableCell>
                                <TableCell>Call Stats</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                        <Typography color="text.secondary">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id} hover>
                                        <TableCell>
                                            <Typography fontWeight="medium">
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                @{user.username}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {user.deviceInfo ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneAndroid fontSize="small" />
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {user.deviceInfo.model || 'Unknown'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {user.deviceInfo.os} • v{user.deviceInfo.appVersion}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography color="text.secondary">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.isOnline ? 'Online' : 'Offline'}
                                                color={user.isOnline ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(user.lastActiveAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Phone fontSize="small" />
                                                <Typography variant="body2">
                                                    {user.totalCalls || 0} calls • {formatDuration(user.totalCallDuration)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => fetchUserDetails(user._id)}
                                                    disabled={detailsLoading}
                                                >
                                                    <History />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* User Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {selectedUser?.user && (
                        <span>{selectedUser.user.firstName} {selectedUser.user.lastName} - Details</span>
                    )}
                    <IconButton onClick={() => setDetailsOpen(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
                        <Tab label="Device Sessions" icon={<PhoneAndroid />} iconPosition="start" />
                        <Tab label="Call History" icon={<History />} iconPosition="start" />
                    </Tabs>

                    {activeTab === 0 && selectedUser && (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Device</TableCell>
                                        <TableCell>Platform</TableCell>
                                        <TableCell>IP Address</TableCell>
                                        <TableCell>Login Time</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedUser.deviceSessions.map((session) => (
                                        <TableRow key={session._id}>
                                            <TableCell>
                                                {session.deviceInfo?.model || 'Unknown Device'}
                                            </TableCell>
                                            <TableCell>
                                                {session.deviceInfo?.os} • {session.deviceInfo?.platform}
                                            </TableCell>
                                            <TableCell>{session.ipAddress || '-'}</TableCell>
                                            <TableCell>{formatDate(session.loginAt)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={session.isActive ? 'Active' : 'Logged Out'}
                                                    color={session.isActive ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {activeTab === 1 && selectedUser && (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Participants</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedUser.callHistory.map((call) => (
                                        <TableRow key={call._id}>
                                            <TableCell>{formatDate(call.startTime)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={call.callType}
                                                    color={call.callType === 'outgoing' ? 'primary' : 'secondary'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{call.participants.join(', ')}</TableCell>
                                            <TableCell>{formatDuration(call.duration)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={call.status}
                                                    color={call.status === 'completed' ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
