import { createTheme } from '@mui/material/styles';

// WhatsApp-Inspired Theme — Let's Connect Admin
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
            main: '#EA0038',
        },
        success: {
            main: '#00a884',
        },
        warning: {
            main: '#F7C948',
        },
        background: {
            default: '#f0f2f5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111b21',
            secondary: '#667781',
        },
        divider: '#e9edef',
    },
    typography: {
        fontFamily: [
            'Segoe UI',
            'Helvetica Neue',
            'Helvetica',
            'Lucida Grande',
            'Arial',
            'Ubuntu',
            'Cantarell',
            'Fira Sans',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 700, fontSize: '2rem', color: '#111b21', lineHeight: 1.2 },
        h2: { fontWeight: 700, fontSize: '1.75rem', color: '#111b21' },
        h3: { fontWeight: 600, fontSize: '1.5rem', color: '#111b21' },
        h4: { fontWeight: 600, fontSize: '1.25rem', color: '#111b21' },
        h5: { fontWeight: 600, fontSize: '1.1rem', color: '#111b21' },
        h6: { fontWeight: 600, fontSize: '1rem', color: '#111b21' },
        button: { textTransform: 'none', fontWeight: 500 },
        body1: { fontSize: '0.875rem', color: '#3b4a54' },
        body2: { fontSize: '0.8125rem', color: '#667781' },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                * { box-sizing: border-box; }

                body {
                    background-color: #f0f2f5;
                    color: #111b21;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #ccced0; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #a8aaac; }
            `,
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                    boxShadow: 'none',
                    transition: 'all 0.15s ease',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedPrimary: {
                    background: '#008069',
                    '&:hover': {
                        background: '#005c4b',
                    },
                },
                outlined: {
                    borderColor: '#e9edef',
                    color: '#3b4a54',
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
                    border: '1px solid #e9edef',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.2s ease',
                    borderRadius: 8,
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #e9edef',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    borderRadius: 8,
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                },
            },
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: '#f0f2f5',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s ease',
                        '& fieldset': { borderColor: 'transparent', borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: '#d1d7db' },
                        '&.Mui-focused fieldset': { borderColor: '#008069', borderWidth: '2px' },
                        '&.Mui-focused': { backgroundColor: '#FFFFFF' },
                    },
                    '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #f0f2f5',
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    color: '#3b4a54',
                },
                head: {
                    color: '#667781',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    letterSpacing: '0.01em',
                    backgroundColor: '#f0f2f5',
                    paddingTop: 10,
                    paddingBottom: 10,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background 0.1s',
                    '&:hover': { backgroundColor: '#f5f6f6' },
                    '&:last-child td': { borderBottom: 0 },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    borderRadius: '16px',
                    height: 24,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    minHeight: 44,
                    color: '#667781',
                    '&.Mui-selected': { color: '#008069' },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: { backgroundColor: '#008069', height: 3, borderRadius: '3px 3px 0 0' },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: '#e9edef' },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: { fontWeight: 600 },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: 8 },
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
