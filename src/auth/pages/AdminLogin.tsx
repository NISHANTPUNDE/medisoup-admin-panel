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
                background: 'radial-gradient(circle at 10% 20%, rgba(37, 211, 102, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 40%), #0b141a',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Decorative Elements */}
            <Box sx={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(37, 211, 102, 0.05)', filter: 'blur(60px)' }} />
            <Box sx={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(102, 126, 234, 0.05)', filter: 'blur(80px)' }} />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={24}
                    sx={{
                        padding: { xs: 4, sm: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 4,
                        background: 'rgba(30, 32, 44, 0.65)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(135deg, #25D366 0%, #4ade80 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
                                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
