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
    Chip,
    CircularProgress,
    TextField,
    MenuItem,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
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

const ACTIVITY_COLORS: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default' | 'primary' | 'secondary'> = {
    login: 'success',
    logout: 'default',
    force_logout: 'error',
    app_opened: 'info',
    app_closed: 'default',
    app_background: 'warning',
    call_started: 'primary',
    call_ended: 'secondary',
    call_missed: 'error',
    call_rejected: 'warning',
    recording_started: 'info',
    recording_stopped: 'default',
};

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
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    const formatActivityType = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const getDeviceInfoStr = (activity: Activity) => {
        if (!activity.deviceInfo) return '-';
        const parts = [];
        if (activity.deviceInfo.model) parts.push(activity.deviceInfo.model);
        if (activity.deviceInfo.os) parts.push(activity.deviceInfo.os);
        if (activity.deviceInfo.platform) parts.push(activity.deviceInfo.platform);
        if (activity.deviceInfo.appVersion) parts.push(`v${activity.deviceInfo.appVersion}`);
        return parts.length > 0 ? parts.join(' · ') : '-';
    };

    const getMetadataStr = (metadata: Record<string, any> | undefined) => {
        if (!metadata || Object.keys(metadata).length === 0) return '-';
        return Object.entries(metadata)
            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
            .join(', ');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
                    User Activity
                </Typography>
                <Tooltip title="Refresh">
                    <IconButton onClick={fetchActivities} disabled={loading}>
                        <Refresh />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
                </Stack>
            </Paper>

            {/* Activity Table */}
            <Paper>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Device Info</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : activities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No activity logs found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((activity) => (
                                    <TableRow key={activity._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {getUserName(activity.userId)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {getUserUsername(activity.userId)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={formatActivityType(activity.activityType)}
                                                color={ACTIVITY_COLORS[activity.activityType] || 'default'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(activity.timestamp)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {getDeviceInfoStr(activity)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                                {activity.ipAddress || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {getMetadataStr(activity.metadata)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            </Paper>
        </Box>
    );
}
