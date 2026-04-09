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
} from '@mui/material';
import {
    RiRefreshLine,
    RiFilterLine,
    RiLoginCircleLine,
    RiLogoutCircleLine,
    RiPhoneLine,
    RiPhoneFill,
    RiSmartphoneLine,
    RiRecordCircleLine,
    RiCalendarLine,
    RiTimeLine,
    RiShieldLine,
    RiWifiLine,
} from 'react-icons/ri';
import { useAuth } from '../../../auth/context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://call.deveraa.com/call';

const ACTIVITY_TYPES = [
    { value: '', label: 'All Activities' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'force_logout', label: 'Force Logout' },
    { value: 'app_opened', label: 'App Opened' },
    { value: 'app_closed', label: 'App Closed' },
    { value: 'app_background', label: 'App Background' },
    { value: 'call_started', label: 'Call Started' },
    { value: 'call_ended', label: 'Call Ended' },
    { value: 'call_missed', label: 'Call Missed' },
    { value: 'call_rejected', label: 'Call Rejected' },
    { value: 'recording_started', label: 'Recording Started' },
    { value: 'recording_stopped', label: 'Recording Stopped' },
];

// Color and icon mapping for activity types
const ACTIVITY_META: Record<string, {
    color: 'success' | 'error' | 'warning' | 'info' | 'default' | 'primary' | 'secondary';
    bg: string;
    textColor: string;
    icon: React.ReactNode;
}> = {
    login:              { color: 'success', bg: 'rgba(16,185,129,0.1)',   textColor: '#059669', icon: <RiLoginCircleLine size={14} /> },
    logout:             { color: 'default', bg: 'rgba(107,114,128,0.1)',  textColor: '#6B7280', icon: <RiLogoutCircleLine size={14} /> },
    force_logout:       { color: 'error',   bg: 'rgba(239,68,68,0.1)',    textColor: '#DC2626', icon: <RiShieldLine size={14} /> },
    app_opened:         { color: 'info',    bg: 'rgba(14,165,233,0.1)',   textColor: '#0284C7', icon: <RiSmartphoneLine size={14} /> },
    app_closed:         { color: 'default', bg: 'rgba(107,114,128,0.1)',  textColor: '#6B7280', icon: <RiSmartphoneLine size={14} /> },
    app_background:     { color: 'warning', bg: 'rgba(245,158,11,0.1)',   textColor: '#D97706', icon: <RiWifiLine size={14} /> },
    call_started:       { color: 'primary', bg: 'rgba(37,99,235,0.1)',    textColor: '#2563EB', icon: <RiPhoneLine size={14} /> },
    call_ended:         { color: 'secondary', bg: 'rgba(139,92,246,0.1)', textColor: '#7C3AED', icon: <RiPhoneFill size={14} /> },
    call_missed:        { color: 'error',   bg: 'rgba(239,68,68,0.1)',    textColor: '#DC2626', icon: <RiPhoneFill size={14} /> },
    call_rejected:      { color: 'warning', bg: 'rgba(245,158,11,0.1)',   textColor: '#D97706', icon: <RiPhoneFill size={14} /> },
    recording_started:  { color: 'info',    bg: 'rgba(14,165,233,0.1)',   textColor: '#0284C7', icon: <RiRecordCircleLine size={14} /> },
    recording_stopped:  { color: 'default', bg: 'rgba(107,114,128,0.1)', textColor: '#6B7280', icon: <RiRecordCircleLine size={14} /> },
};

const DEFAULT_META = { color: 'default' as const, bg: 'rgba(107,114,128,0.1)', textColor: '#6B7280', icon: <RiTimeLine size={14} /> };

interface Activity {
    _id: string;
    userId: {
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
    } | string;
    activityType: string;
    deviceId?: string;
    deviceInfo?: {
        model?: string;
        os?: string;
        appVersion?: string;
        platform?: string;
    };
    ipAddress?: string;
    metadata?: Record<string, any>;
    timestamp: string;
    createdAt: string;
}

// Summary stat card
const StatBadge = ({ label, count, color }: { label: string; count: number; color: string }) => (
    <Box sx={{
        px: 2, py: 1, borderRadius: '8px',
        background: `${color}12`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', gap: 1,
    }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color }}>{count}</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>{label}</Typography>
    </Box>
);

export default function UserActivity() {
    const { token } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [activityType, setActivityType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('limit', String(rowsPerPage));
            params.set('offset', String(page * rowsPerPage));
            if (activityType) params.set('activityType', activityType);
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);

            const response = await fetch(`${API_URL}/api/admin/user-activity?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setActivities(data.data.activities || []);
                setTotalCount(data.data.totalCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    }, [token, page, rowsPerPage, activityType, startDate, endDate]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const getUserName = (userId: Activity['userId']) => {
        if (typeof userId === 'string') return userId;
        return `${userId.firstName} ${userId.lastName}`;
    };

    const getUserUsername = (userId: Activity['userId']) => {
        if (typeof userId === 'string') return '';
        return userId.username;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        });
    };

    const formatActivityType = (type: string) =>
        type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const getDeviceInfoStr = (activity: Activity) => {
        if (!activity.deviceInfo) return '—';
        const parts = [];
        if (activity.deviceInfo.model) parts.push(activity.deviceInfo.model);
        if (activity.deviceInfo.os) parts.push(activity.deviceInfo.os);
        if (activity.deviceInfo.platform) parts.push(activity.deviceInfo.platform);
        if (activity.deviceInfo.appVersion) parts.push(`v${activity.deviceInfo.appVersion}`);
        return parts.length > 0 ? parts.join(' · ') : '—';
    };

    const getMetadataStr = (metadata: Record<string, any> | undefined) => {
        if (!metadata || Object.keys(metadata).length === 0) return '—';
        return Object.entries(metadata)
            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
            .join(', ');
    };

    // Quick count for summary badges
    const loginCount = activities.filter(a => a.activityType === 'login').length;
    const callCount = activities.filter(a => a.activityType === 'call_started').length;
    const missedCount = activities.filter(a => a.activityType === 'call_missed').length;

    // Avatar palette
    const avatarColors = ['#2563EB', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
                        User Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Track all user actions — login, logout, calls, recordings &amp; more
                    </Typography>
                </Box>
                <Tooltip title="Refresh">
                    <IconButton
                        onClick={fetchActivities}
                        disabled={loading}
                        sx={{
                            border: '1px solid #E5E7EB', borderRadius: '10px',
                            '&:hover': { background: 'rgba(37,99,235,0.06)', borderColor: '#2563EB' },
                        }}
                    >
                        <RiRefreshLine style={{ color: loading ? '#D1D5DB' : '#2563EB' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Summary badges (for current page) */}
            {!loading && activities.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#9CA3AF', mr: 0.5, fontWeight: 500 }}>This page:</Typography>
                    <StatBadge label="Logins" count={loginCount} color="#10B981" />
                    <StatBadge label="Calls Started" count={callCount} color="#2563EB" />
                    <StatBadge label="Missed Calls" count={missedCount} color="#EF4444" />
                    <StatBadge label="Total Events" count={activities.length} color="#8B5CF6" />
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
                        select
                        label="Activity Type"
                        value={activityType}
                        onChange={(e) => { setActivityType(e.target.value); setPage(0); }}
                        sx={{ minWidth: 200 }}
                        size="small"
                    >
                        {ACTIVITY_TYPES.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
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
                                <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>User</TableCell>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={32} />
                                        <Typography sx={{ mt: 1, color: '#9CA3AF', fontSize: '0.875rem' }}>Loading activities...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : activities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <RiTimeLine style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 8 }} />
                                        <Typography color="text.secondary">No activity logs found</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', mt: 0.5 }}>Try adjusting filters or date range</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((activity, idx) => {
                                    const meta = ACTIVITY_META[activity.activityType] || DEFAULT_META;
                                    return (
                                        <TableRow key={activity._id} hover sx={{ '&:hover': { background: '#F9FAFB' } }}>
                                            {/* User */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{
                                                        width: 30, height: 30, fontSize: '0.7rem', fontWeight: 700,
                                                        background: `linear-gradient(135deg, ${avatarColors[idx % avatarColors.length]}, ${avatarColors[(idx + 1) % avatarColors.length]})`,
                                                    }}>
                                                        {getUserName(activity.userId)?.charAt(0) || '?'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2937', lineHeight: 1.3 }}>
                                                            {getUserName(activity.userId)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                                                            @{getUserUsername(activity.userId)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Activity Type */}
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 0.6,
                                                    px: 1.2, py: 0.4, borderRadius: '6px',
                                                    background: meta.bg,
                                                }}>
                                                    <Box sx={{ color: meta.textColor, display: 'flex', alignItems: 'center' }}>
                                                        {meta.icon}
                                                    </Box>
                                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: meta.textColor, whiteSpace: 'nowrap' }}>
                                                        {formatActivityType(activity.activityType)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Timestamp */}
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.78rem', color: '#374151' }}>
                                                    {formatDate(activity.timestamp)}
                                                </Typography>
                                            </TableCell>

                                            {/* Device */}
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.78rem', color: '#6B7280', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {getDeviceInfoStr(activity)}
                                                </Typography>
                                            </TableCell>

                                            {/* IP */}
                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#6B7280' }}>
                                                    {activity.ipAddress || '—'}
                                                </Typography>
                                            </TableCell>

                                            {/* Metadata */}
                                            <TableCell>
                                                <Tooltip title={getMetadataStr(activity.metadata)} placement="left">
                                                    <Typography sx={{ fontSize: '0.78rem', color: '#6B7280', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {getMetadataStr(activity.metadata)}
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
                        Total: {totalCount.toLocaleString()} events
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
