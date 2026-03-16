import { createTheme } from '@mui/material/styles';

// Light Dashboard Theme
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2563EB', // Blue
            light: '#60A5FA',
            dark: '#1D4ED8',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#38BDF8', // Sky
            light: '#7DD3FC',
            dark: '#0284C7',
            contrastText: '#ffffff',
        },
        error: {
            main: '#EF4444',
        },
        background: {
            default: '#F8FAFC', // Light Gray
            paper: '#FFFFFF', // White
        },
        text: {
            primary: '#1F2937', // Dark Gray
            secondary: '#6B7280',
        },
        divider: '#E5E7EB', // Light Gray border
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
        h1: { fontWeight: 700, fontSize: '2.5rem', color: '#1F2937' },
        h2: { fontWeight: 600, fontSize: '2rem', color: '#1F2937' },
        h3: { fontWeight: 600, fontSize: '1.75rem', color: '#1F2937' },
        h4: { fontWeight: 600, fontSize: '1.5rem', color: '#1F2937' },
        h5: { fontWeight: 600, fontSize: '1.25rem', color: '#1F2937' },
        h6: { fontWeight: 600, fontSize: '1rem', color: '#1F2937' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                body {
                    background-color: #F8FAFC;
                    color: #1F2937;
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
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                    },
                },
                containedPrimary: {
                    background: '#2563EB',
                    '&:hover': {
                        background: '#1D4ED8',
                    },
                },
                containedSecondary: {
                    background: '#38BDF8',
                    '&:hover': {
                        background: '#0284C7',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    borderRadius: 16,
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
                },
                elevation3: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                elevation24: {
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: '#FFFFFF',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                            borderColor: '#E5E7EB',
                        },
                        '&:hover fieldset': {
                            borderColor: '#9CA3AF',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#2563EB',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #E5E7EB',
                    color: '#6B7280',
                },
                head: {
                    color: '#1F2937',
                    fontWeight: 600,
                    backgroundColor: '#F8FAFC',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#E5E7EB',
                }
            }
        }
    },
});
