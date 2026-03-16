import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
});

const AdminLogin: React.FC = () => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            await login(values.username, values.password, 'admin');
        } catch (error) {
            // Error is handled in AuthContext with toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8FAFC',
            }}
        >
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={3}
                    sx={{
                        padding: { xs: 4, sm: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 4,
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#2563EB' }}>
                            Admin Portal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to manage your users and calls
                        </Typography>
                    </Box>
                    
                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, values, handleChange, handleBlur }) => (
                            <Form style={{ width: '100%' }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="username"
                                    label="Username"
                                    placeholder="Enter your username"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                    disabled={loading}
                                />
                                
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    disabled={loading}
                                />
                                
                                <Button
                                    type="submit"
                                    color="primary"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 4, mb: 1, py: 1.5, fontSize: '1.1rem' }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={26} color="inherit" /> : 'Log In'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminLogin;
