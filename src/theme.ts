import { createTheme } from '@mui/material/styles';

// Premium Dark Mode with Glassmorphism Theme
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#25D366', // Neon Green/Success
            light: '#4ade80',
            dark: '#16a34a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#667eea', // Deep Purple base
            light: '#8b9ef5',
            dark: '#4c5fd4',
            contrastText: '#ffffff',
        },
        error: {
            main: '#EF4444', // Crimson
        },
        background: {
            default: '#0b141a', // Deep dark
            paper: '#1E202C', // Surface cards
        },
        text: {
            primary: '#ffffff',
            secondary: '#A0AEC0',
        },
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
        h1: { fontWeight: 700, fontSize: '2.5rem', color: '#ffffff' },
        h2: { fontWeight: 600, fontSize: '2rem', color: '#ffffff' },
        h3: { fontWeight: 600, fontSize: '1.75rem', color: '#ffffff' },
        h4: { fontWeight: 600, fontSize: '1.5rem', color: '#ffffff' },
        h5: { fontWeight: 600, fontSize: '1.25rem', color: '#ffffff' },
        h6: { fontWeight: 600, fontSize: '1rem', color: '#ffffff' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                body {
                    background-color: #0b141a;
                    color: #ffffff;
                }
                * {
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }
            `,
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #25D366 0%, #16a34a 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4ade80 0%, #25D366 100%)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #654090 100%)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(30, 32, 44, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(30, 32, 44, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundImage: 'none',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#25D366',
                            boxShadow: '0 0 0 2px rgba(37, 211, 102, 0.2)',
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    color: '#A0AEC0',
                },
                head: {
                    color: '#ffffff',
                    fontWeight: 600,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
            },
        },
    },
});
