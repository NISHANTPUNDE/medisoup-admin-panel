import { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    CircularProgress,
    TextField,
    MenuItem,
    Stack,
    IconButton,
    Tooltip,
    Avatar,
    Button,
    Chip,
} from '@mui/material';
import {
    RiRefreshLine,
    RiFilterLine,
    RiLoginCircleLine,
    RiLogoutCircleLine,
    RiCalendarLine,
    RiTimeLine,
    RiShieldLine,
    RiArrowLeftLine,
    RiUserLine,
} from 'react-icons/ri';
import { useAuth } from '../../../auth/context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://call.deveraa.com/call';

const ACTIVITY_TYPES = [
    { value: '', label: 'All Activities' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'force_logout', label: 'Force Logout' },
];

const ACTIVITY_META: Record<string, { bg: string; textColor: string; icon: React.ReactNode }> = {
    login:              { bg: 'rgba(0,168,132,0.1)',    textColor: '#008069', icon: <RiLoginCircleLine size={14} /> },
    logout:             { bg: 'rgba(107,114,128,0.1)',  textColor: '#6B7280', icon: <RiLogoutCircleLine size={14} /> },
    force_logout:       { bg: 'rgba(239,68,68,0.1)',    textColor: '#DC2626', icon: <RiShieldLine size={14} /> },
};
const DEFAULT_META = { bg: 'rgba(107,114,128,0.1)', textColor: '#6B7280', icon: <RiTimeLine size={14} /> };

interface UserSummary {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    lastActivity?: string;
    activityCount?: number;
}

interface Activity {
    _id: string;
    userId: { _id: string; username: string; firstName: string; lastName: string } | string;
    activityType: string;
    deviceId?: string;
    deviceInfo?: { model?: string; os?: string; appVersion?: string; platform?: string };
    ipAddress?: string;
    metadata?: Record<string, any>;
    timestamp: string;
    createdAt: string;
}

const avatarColors = ['#2563EB', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function UserActivity() {
    const { token } = useAuth();

    // Step 1: user list view
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [userSearch, setUserSearch] = useState('');

    // Step 2: selected user details view
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [activityType, setActivityType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Load user list
    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/users?offset=0&limit=200`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users || data.data?.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setUsersLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // Load activities for selected user
    const fetchActivities = useCallback(async () => {
        if (!selectedUser) return;
        setActivitiesLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('limit', String(rowsPerPage));
            params.set('offset', String(page * rowsPerPage));
            params.set('userId', selectedUser._id);
            if (activityType) params.set('activityType', activityType);
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);

            const response = await fetch(`${API_URL}/api/admin/user-activity?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.success) {
                setActivities(data.data?.activities || []);
                setTotalCount(data.data?.totalCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setActivitiesLoading(false);
        }
    }, [token, selectedUser, page, rowsPerPage, activityType, startDate, endDate]);

    useEffect(() => { fetchActivities(); }, [fetchActivities]);

    const handleSelectUser = (user: UserSummary) => {
        setSelectedUser(user);
        setPage(0);
        setActivityType('login'); // default to login/logout only
        setStartDate('');
        setEndDate('');
    };

    const handleBack = () => {
        setSelectedUser(null);
        setActivities([]);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
        });
    };

    const formatActivityType = (type: string) =>
        type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const filteredUsers = users.filter(u =>
        !userSearch ||
        u.firstName?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username?.toLowerCase().includes(userSearch.toLowerCase())
    );

    // --- USER LIST VIEW ---
    if (!selectedUser) {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>User Activity</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Select a user to view their activity log
                        </Typography>
                    </Box>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchUsers} disabled={usersLoading}
                            sx={{ border: '1px solid #E5E7EB', borderRadius: '10px', '&:hover': { background: 'rgba(37,99,235,0.06)', borderColor: '#2563EB' } }}>
                            <RiRefreshLine style={{ color: usersLoading ? '#D1D5DB' : '#2563EB' }} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Paper sx={{ p: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search users by name or username..."
                        variant="outlined"
                        size="small"
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <Box sx={{ mr: 1, color: '#9CA3AF', display: 'flex' }}><RiUserLine size={18} /></Box>
                        }}
                    />
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="center">View Activity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usersLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={32} />
                                        <Typography sx={{ mt: 1, color: '#9CA3AF', fontSize: '0.875rem' }}>Loading users...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                        <RiUserLine style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 8 }} />
                                        <Typography color="text.secondary">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <TableRow key={user._id} hover sx={{ cursor: 'pointer', '&:hover': { background: '#F9FAFB' } }}
                                        onClick={() => handleSelectUser(user)}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{
                                                    width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                                                    background: `linear-gradient(135deg, ${avatarColors[idx % avatarColors.length]}, ${avatarColors[(idx + 1) % avatarColors.length]})`,
                                                }}>
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1F2937' }}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>@{user.username}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label="View Activity →"
                                                size="small"
                                                sx={{
                                                    background: 'rgba(37,99,235,0.08)', color: '#2563EB',
                                                    fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                                                    '&:hover': { background: 'rgba(37,99,235,0.15)' }
                                                }}
                                                onClick={() => handleSelectUser(user)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }

    // --- ACTIVITY DETAIL VIEW ---
    const loginCount = activities.filter(a => a.activityType === 'login').length;
    const logoutCount = activities.filter(a => a.activityType === 'logout').length;

    return (
        <Box>
            {/* Header with back button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RiArrowLeftLine />}
                        onClick={handleBack}
                        size="small"
                        sx={{ borderRadius: '8px', borderColor: '#E5E7EB', color: '#6B7280', '&:hover': { borderColor: '#2563EB', color: '#2563EB' } }}
                    >
                        All Users
                    </Button>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
                            {selectedUser.firstName} {selectedUser.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                            @{selectedUser.username} • Activity Log
                        </Typography>
                    </Box>
                </Box>
                <Tooltip title="Refresh">
                    <IconButton onClick={fetchActivities} disabled={activitiesLoading}
                        sx={{ border: '1px solid #E5E7EB', borderRadius: '10px', '&:hover': { background: 'rgba(37,99,235,0.06)', borderColor: '#2563EB' } }}>
                        <RiRefreshLine style={{ color: activitiesLoading ? '#D1D5DB' : '#2563EB' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Summary badges */}
            {!activitiesLoading && activities.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#9CA3AF', mr: 0.5, fontWeight: 500 }}>This page:</Typography>
                    {[
                        { label: 'Logins', count: loginCount, color: '#008069' },
                        { label: 'Logouts', count: logoutCount, color: '#667781' },
                        { label: 'Total Events', count: activities.length, color: '#8B5CF6' },
                    ].map(b => (
                        <Box key={b.label} sx={{ px: 2, py: 1, borderRadius: '8px', background: `${b.color}12`, border: `1px solid ${b.color}30`, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: b.color }}>{b.count}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>{b.label}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6B7280' }}>
                        <RiFilterLine size={16} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Filters:</Typography>
                    </Box>
                    <TextField
                        select label="Activity Type" value={activityType}
                        onChange={(e) => { setActivityType(e.target.value); setPage(0); }}
                        sx={{ minWidth: 200 }} size="small"
                    >
                        {ACTIVITY_TYPES.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Start Date" type="date" value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                        InputLabelProps={{ shrink: true }} size="small" />
                    <TextField label="End Date" type="date" value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                        InputLabelProps={{ shrink: true }} size="small" />
                    {(activityType || startDate || endDate) && (
                        <Typography
                            sx={{ fontSize: '0.8rem', color: '#2563EB', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                            onClick={() => { setActivityType(''); setStartDate(''); setEndDate(''); setPage(0); }}
                        >
                            Clear filters
                        </Typography>
                    )}
                </Stack>
            </Paper>

            {/* Activity Table */}
            <Paper>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Activity</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <RiCalendarLine size={13} /> Timestamp
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Device Info</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>IP Address</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activitiesLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={32} />
                                        <Typography sx={{ mt: 1, color: '#9CA3AF', fontSize: '0.875rem' }}>Loading activities...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : activities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <RiTimeLine style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 8 }} />
                                        <Typography color="text.secondary">No activity logs found</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', mt: 0.5 }}>Try adjusting filters or date range</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((activity) => {
                                    const meta = ACTIVITY_META[activity.activityType] || DEFAULT_META;
                                    const deviceInfo = activity.deviceInfo;
                                    const deviceStr = deviceInfo
                                        ? [deviceInfo.model, deviceInfo.os, deviceInfo.platform, deviceInfo.appVersion ? `v${deviceInfo.appVersion}` : ''].filter(Boolean).join(' · ')
                                        : '—';
                                    const metaStr = activity.metadata && Object.keys(activity.metadata).length > 0
                                        ? Object.entries(activity.metadata).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(', ')
                                        : '—';
                                    return (
                                        <TableRow key={activity._id} hover sx={{ '&:hover': { background: '#F9FAFB' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.2, py: 0.4, borderRadius: '6px', background: meta.bg }}>
                                                    <Box sx={{ color: meta.textColor, display: 'flex', alignItems: 'center' }}>{meta.icon}</Box>
                                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: meta.textColor, whiteSpace: 'nowrap' }}>
                                                        {formatActivityType(activity.activityType)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.78rem', color: '#374151' }}>
                                                    {formatDate(activity.timestamp)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.78rem', color: '#6B7280', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {deviceStr}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#6B7280' }}>
                                                    {activity.ipAddress || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={metaStr} placement="left">
                                                    <Typography sx={{ fontSize: '0.78rem', color: '#6B7280', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {metaStr}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 2 }}>
                    <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                        Total: {totalCount.toLocaleString()} events for {selectedUser.firstName} {selectedUser.lastName}
                    </Typography>
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Box>
            </Paper>
        </Box>
    );
}
