import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';
import { RiLogoutBoxLine } from 'react-icons/ri';

interface LogoutConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({ open, onClose, onConfirm }) => (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: 380 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 1 }}>
            <RiLogoutBoxLine size={20} color="#EF4444" />
            <Typography component="span" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                Confirm Logout
            </Typography>
        </DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ fontSize: '0.9rem' }}>
                Are you sure you want to logout?
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                variant="contained"
                sx={{ borderRadius: '8px', background: '#EF4444', '&:hover': { background: '#DC2626' } }}
            >
                Logout
            </Button>
        </DialogActions>
    </Dialog>
);

export default LogoutConfirmDialog;
