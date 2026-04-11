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
    Avatar,
} from '@mui/material';
import {
    RiSmartphoneLine,
    RiHistoryLine,
    RiRefreshLine,
    RiCloseLine,
    RiPhoneLine,
    RiPhoneFill,
    RiWifiLine,
    RiWifiOffLine,
    RiDeviceLine,
    RiLockLine,
    RiLockUnlockLine,
} from 'react-icons/ri';

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
    lockedDeviceId?: string | null;
    deviceLockedAt?: string | null;
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
    const [lockingUserId, setLockingUserId] = useState<string | null>(null);

    const token = localStorage.getItem('token') || '';
    // Read adminId from the stored user object (set by AuthContext on login)
    const adminId = (() => {
        try {
            const u = localStorage.getItem('user');
            const parsed = u ? JSON.parse(u) : null;
            return parsed?.id || parsed?._id || '';
        } catch { return ''; }
    })();

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/admin/${adminId}/users?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
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
            const response = await fetch(`${API_URL}/api/admin/${adminId}/users/${userId}/details`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
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

    const handleLockDevice = async (user: UserWithDevice) => {
        // Find their active device session
        if (!user.recentDevices || user.recentDevices.length === 0) {
            setError('User has no registered device to lock to.');
            return;
        }
        const activeSession = user.recentDevices.find((d: DeviceSession) => d.isActive) || user.recentDevices[0];
        if (!activeSession?.deviceId) {
            setError('No device ID found for this user.');
            return;
        }
        setLockingUserId(user._id);
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${user._id}/lock-device`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    deviceId: activeSession.deviceId,
                    deviceInfo: activeSession.deviceInfo,
                    note: `Locked by admin on ${new Date().toLocaleDateString()}`,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setUsers(prev => prev.map(u => u._id === user._id
                    ? { ...u, lockedDeviceId: activeSession.deviceId, deviceLockedAt: new Date().toISOString() }
                    : u
                ));
            } else {
                setError(data.message || 'Failed to lock device');
            }
        } catch {
            setError('Failed to lock device');
        } finally {
            setLockingUserId(null);
        }
    };

    const handleUnlockDevice = async (userId: string) => {
        setLockingUserId(userId);
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${userId}/unlock-device`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setUsers(prev => prev.map(u => u._id === userId
                    ? { ...u, lockedDeviceId: null, deviceLockedAt: null }
                    : u
                ));
            } else {
                setError(data.message || 'Failed to unlock device');
            }
        } catch {
            setError('Failed to unlock device');
        } finally {
            setLockingUserId(null);
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '—';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
        });
    };

    const onlineUsers = users.filter(u => u.isOnline).length;
    const avatarColors = ['#2563EB', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
                        Devices &amp; Call History
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Monitor real-time device status and call statistics
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<RiRefreshLine />}
                    onClick={fetchUsers}
                    disabled={loading}
                    size="small"
                    sx={{ borderRadius: '10px' }}
                >
                    Refresh
                </Button>
            </Box>

            {/* Quick stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Users', value: users.length, color: '#2563EB', icon: <RiDeviceLine /> },
                    { label: 'Online Now', value: onlineUsers, color: '#10B981', icon: <RiWifiLine /> },
                    { label: 'Offline', value: users.length - onlineUsers, color: '#6B7280', icon: <RiWifiOffLine /> },
                ].map(stat => (
                    <Paper key={stat.label} sx={{
                        px: 2.5, py: 2, flex: 1, minWidth: 140,
                        display: 'flex', alignItems: 'center', gap: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
                    }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                            {stat.icon}
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 500 }}>{stat.label}</Typography>
                            <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#1F2937', lineHeight: 1 }}>{stat.value}</Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Device</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 110 }}>Last Active</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>Call Stats</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Device Lock</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                        <RiSmartphoneLine style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 8 }} />
                                        <Typography color="text.secondary">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user, idx) => (
                                    <TableRow key={user._id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ position: 'relative' }}>
                                                    <Avatar sx={{
                                                        width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                                                        background: `linear-gradient(135deg, ${avatarColors[idx % avatarColors.length]}, ${avatarColors[(idx + 1) % avatarColors.length]})`,
                                                    }}>
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </Avatar>
                                                    {/* Online/offline dot */}
                                                    <Box sx={{
                                                        position: 'absolute', bottom: -1, right: -1,
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        background: user.isOnline ? '#10B981' : '#D1D5DB',
                                                        border: '2px solid #fff',
                                                    }} />
                                                </Box>
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
                                            {user.deviceInfo ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <RiSmartphoneLine style={{ color: '#6B7280', fontSize: 16 }} />
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.8rem', color: '#374151' }}>
                                                            {user.deviceInfo.model || 'Unknown'}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                                                            {user.deviceInfo.os} • v{user.deviceInfo.appVersion}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography sx={{ color: '#D1D5DB', fontSize: '0.85rem' }}>—</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                display: 'inline-flex', alignItems: 'center', gap: 0.6,
                                                px: 1.2, py: 0.4, borderRadius: '6px',
                                                background: user.isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                                            }}>
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: user.isOnline ? '#10B981' : '#9CA3AF' }} />
                                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: user.isOnline ? '#059669' : '#6B7280' }}>
                                                    {user.isOnline ? 'Online' : 'Offline'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                                {formatDate(user.lastActiveAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <RiPhoneLine style={{ color: '#2563EB', fontSize: 15 }} />
                                                <Typography sx={{ fontSize: '0.8rem', color: '#374151' }}>
                                                    {user.totalCalls || 0} calls
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                    · {formatDuration(user.totalCallDuration)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                {user.lockedDeviceId ? (
                                                    <Box sx={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                                        px: 1, py: 0.3, borderRadius: '6px',
                                                        background: 'rgba(239,68,68,0.1)',
                                                        border: '1px solid rgba(239,68,68,0.25)',
                                                        width: 'fit-content',
                                                    }}>
                                                        <RiLockLine style={{ color: '#DC2626', fontSize: 12 }} />
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#DC2626' }}>LOCKED</Typography>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                                        px: 1, py: 0.3, borderRadius: '6px',
                                                        background: 'rgba(16,185,129,0.1)',
                                                        border: '1px solid rgba(16,185,129,0.25)',
                                                        width: 'fit-content',
                                                    }}>
                                                        <RiLockUnlockLine style={{ color: '#059669', fontSize: 12 }} />
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669' }}>FREE</Typography>
                                                    </Box>
                                                )}
                                                {user.lockedDeviceId && (
                                                    <Typography sx={{ fontSize: '0.65rem', color: '#9CA3AF', fontFamily: 'monospace' }}
                                                        title={user.lockedDeviceId}>
                                                        {user.lockedDeviceId.slice(0, 18)}…
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                                <Tooltip title="View Device & Call Details">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => fetchUserDetails(user._id)}
                                                        disabled={detailsLoading}
                                                        sx={{
                                                            border: '1px solid rgba(37,99,235,0.2)',
                                                            borderRadius: '8px',
                                                            '&:hover': { background: 'rgba(37,99,235,0.08)' },
                                                        }}
                                                    >
                                                        <RiHistoryLine size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                {user.lockedDeviceId ? (
                                                    <Tooltip title="Unlock device — allow login from any device">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleUnlockDevice(user._id)}
                                                            disabled={lockingUserId === user._id}
                                                            sx={{
                                                                border: '1px solid rgba(239,68,68,0.25)',
                                                                borderRadius: '8px',
                                                                color: '#DC2626',
                                                                '&:hover': { background: 'rgba(239,68,68,0.08)' },
                                                            }}
                                                        >
                                                            <RiLockLine size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Lock to current device">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleLockDevice(user)}
                                                            disabled={lockingUserId === user._id || !user.recentDevices?.length}
                                                            sx={{
                                                                border: '1px solid rgba(16,185,129,0.25)',
                                                                borderRadius: '8px',
                                                                color: '#059669',
                                                                '&:hover': { background: 'rgba(16,185,129,0.08)' },
                                                            }}
                                                        >
                                                            <RiLockUnlockLine size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
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
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', fontSize: '0.85rem', fontWeight: 700 }}>
                            {selectedUser?.user?.firstName?.charAt(0)}{selectedUser?.user?.lastName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1F2937' }}>
                                {selectedUser?.user?.firstName} {selectedUser?.user?.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>@{selectedUser?.user?.username}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setDetailsOpen(false)} size="small">
                        <RiCloseLine />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        sx={{
                            mb: 2,
                            '& .MuiTab-root': { fontSize: '0.85rem', fontWeight: 600 },
                            '& .MuiTabs-indicator': { background: '#2563EB' },
                        }}
                    >
                        <Tab
                            label="Device Sessions"
                            icon={<RiSmartphoneLine size={16} />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Call History"
                            icon={<RiHistoryLine size={16} />}
                            iconPosition="start"
                        />
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
                                    {selectedUser.deviceSessions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                <Typography color="text.secondary">No device sessions recorded</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : selectedUser.deviceSessions.map((session) => (
                                        <TableRow key={session._id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <RiSmartphoneLine style={{ color: '#6B7280' }} />
                                                    <Typography sx={{ fontSize: '0.8rem' }}>
                                                        {session.deviceInfo?.model || 'Unknown Device'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                                    {session.deviceInfo?.os} • {session.deviceInfo?.platform}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#6B7280' }}>
                                                    {session.ipAddress || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#374151' }}>
                                                    {formatDate(session.loginAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                                    px: 1, py: 0.3, borderRadius: '6px',
                                                    background: session.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                                                }}>
                                                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: session.isActive ? '#10B981' : '#9CA3AF' }} />
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: session.isActive ? '#059669' : '#6B7280' }}>
                                                        {session.isActive ? 'Active' : 'Logged Out'}
                                                    </Typography>
                                                </Box>
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
                                    {selectedUser.callHistory.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                <Typography color="text.secondary">No call history found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : selectedUser.callHistory.map((call) => (
                                        <TableRow key={call._id} hover>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#374151' }}>
                                                    {formatDate(call.startTime)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                                    px: 1, py: 0.3, borderRadius: '6px',
                                                    background: call.callType === 'outgoing' ? 'rgba(37,99,235,0.1)' : 'rgba(139,92,246,0.1)',
                                                }}>
                                                    {call.callType === 'outgoing'
                                                        ? <RiPhoneLine size={12} style={{ color: '#2563EB' }} />
                                                        : <RiPhoneLine size={12} style={{ color: '#7C3AED' }} />
                                                    }
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: call.callType === 'outgoing' ? '#2563EB' : '#7C3AED', textTransform: 'capitalize' }}>
                                                        {call.callType}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {call.participants.join(', ')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#374151' }}>
                                                    {formatDuration(call.duration)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                                    px: 1, py: 0.3, borderRadius: '6px',
                                                    background: call.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                }}>
                                                    {call.status === 'completed'
                                                        ? <RiPhoneLine size={12} style={{ color: '#059669' }} />
                                                        : <RiPhoneFill size={12} style={{ color: '#DC2626' }} />
                                                    }
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: call.status === 'completed' ? '#059669' : '#DC2626', textTransform: 'capitalize' }}>
                                                        {call.status}
                                                    </Typography>
                                                </Box>
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
