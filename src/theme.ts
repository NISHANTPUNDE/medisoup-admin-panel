import { createTheme } from '@mui/material/styles';

// Professional White Theme — Let's Connect Admin (WhatsApp-green accents on white)
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#008069',
            light: '#00a884',
            dark: '#005c4b',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#25D366',
            light: '#4AE07E',
            dark: '#1DA851',
            contrastText: '#ffffff',
        },
        error: {
            main: '#EF4444',
        },
        success: {
            main: '#00a884',
        },
        warning: {
            main: '#F59E0B',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
        },
        divider: '#E5E7EB',
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 800, fontSize: '2.25rem', color: '#1F2937', lineHeight: 1.2 },
        h2: { fontWeight: 700, fontSize: '1.875rem', color: '#1F2937' },
        h3: { fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' },
        h4: { fontWeight: 700, fontSize: '1.25rem', color: '#1F2937' },
        h5: { fontWeight: 700, fontSize: '1.125rem', color: '#1F2937' },
        h6: { fontWeight: 600, fontSize: '1rem', color: '#1F2937' },
        button: { textTransform: 'none', fontWeight: 600 },
        body1: { fontSize: '0.875rem', color: '#374151' },
        body2: { fontSize: '0.8125rem', color: '#6B7280' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                * { box-sizing: border-box; }

                body {
                    background-color: #F8FAFC;
                    color: #1F2937;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                ::-webkit-scrollbar { width: 5px; height: 5px; }
                ::-webkit-scrollbar-track { background: #F3F4F6; }
                ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
            `,
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '9px 20px',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 'none',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                containedPrimary: {
                    background: '#008069',
                    boxShadow: '0 4px 12px rgba(0,128,105,0.25)',
                    '&:hover': {
                        background: '#005c4b',
                        boxShadow: '0 6px 16px rgba(0,128,105,0.35)',
                    },
                },
                outlined: {
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    '&:hover': {
                        borderColor: '#008069',
                        background: 'rgba(0,128,105,0.04)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    borderRadius: 16,
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    borderRadius: 12,
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                },
                elevation3: {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        '& fieldset': { borderColor: '#E5E7EB', borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: '#9CA3AF' },
                        '&.Mui-focused fieldset': { borderColor: '#008069', borderWidth: '1.5px' },
                        '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(0,128,105,0.08)' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#008069' },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #F3F4F6',
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    color: '#374151',
                },
                head: {
                    color: '#6B7280',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: '#F9FAFB',
                    paddingTop: 10,
                    paddingBottom: 10,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background 0.1s',
                    '&:hover': { backgroundColor: '#F9FAFB' },
                    '&:last-child td': { borderBottom: 0 },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    borderRadius: '6px',
                    height: 24,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    minHeight: 44,
                    '&.Mui-selected': { color: '#008069' },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: { backgroundColor: '#008069', height: 2 },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: '#E5E7EB' },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: { fontWeight: 700 },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: 10 },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': { color: '#00a884' },
                    '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00a884' },
                },
            },
        },
    },
});
