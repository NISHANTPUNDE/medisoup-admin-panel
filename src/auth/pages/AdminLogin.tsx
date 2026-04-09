import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    InputAdornment,
    IconButton,
    Link,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { RiShieldUserLine, RiEyeLine, RiEyeOffLine, RiLockPasswordLine, RiUserLine, RiPhoneLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const AdminLogin: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                background: '#F8FAFC',
            }}
        >
            {/* Left accent panel */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    width: '42%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)',
                    p: 6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <Box sx={{
                    position: 'absolute', top: -60, right: -60,
                    width: 220, height: 220, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                }} />
                <Box sx={{
                    position: 'absolute', bottom: -80, left: -80,
                    width: 280, height: 280, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />

                <Box sx={{ textAlign: 'center', zIndex: 1 }}>
                    <Box sx={{
                        width: 80, height: 80, borderRadius: '24px',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3, backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                    }}>
                        <RiPhoneLine style={{ fontSize: 40, color: '#fff' }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 1.5 }}>
                        SkyVoice
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 260, lineHeight: 1.7 }}>
                        Professional calling platform for seamless team communication
                    </Typography>

                    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {['Manage your team users', 'Monitor call activity', 'Track user presence'].map((item) => (
                            <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{item}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Right login form */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, md: 6 },
                }}
            >
                <Container maxWidth="xs">
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5, mb: 1,
                            '& svg': { color: '#2563EB', fontSize: 28 }
                        }}>
                            <RiShieldUserLine />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
                                Admin Portal
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to manage your users and call activities
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, values, handleChange, handleBlur }) => (
                            <Form style={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        fullWidth
                                        name="username"
                                        label="Username"
                                        placeholder="Enter your username"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.username && Boolean(errors.username)}
                                        helperText={touched.username && errors.username}
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <RiUserLine style={{ color: '#9CA3AF' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <RiLockPasswordLine style={{ color: '#9CA3AF' }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                        {showPassword
                                                            ? <RiEyeOffLine style={{ color: '#9CA3AF' }} />
                                                            : <RiEyeLine style={{ color: '#9CA3AF' }} />
                                                        }
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        color="primary"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 1, py: 1.5, fontSize: '1rem',
                                            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                                            boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
                                            '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' },
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Superadmin?{' '}
                            <Link
                                component="button"
                                onClick={() => navigate('/superadmin')}
                                sx={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminLogin;
