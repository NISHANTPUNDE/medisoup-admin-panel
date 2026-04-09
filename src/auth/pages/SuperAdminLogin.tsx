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
import { RiAdminLine, RiEyeLine, RiEyeOffLine, RiLockPasswordLine, RiUserLine, RiPhoneLine, RiShieldCheckLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const SuperAdminLogin: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            await login(values.username, values.password, 'superadmin');
        } catch (error) {
            console.error('Login error:', error);
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
            {/* Left accent panel - sky blue for superadmin */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    width: '42%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%)',
                    p: 6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
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
                        System administration console — global access control
                    </Typography>

                    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {['Manage all admin accounts', 'Set user creation limits', 'Full system oversight'].map((item) => (
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
                            '& svg': { color: '#0EA5E9', fontSize: 28 }
                        }}>
                            <RiShieldCheckLine />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
                                SuperAdmin
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Access system configuration and manage all admins
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
                                        label="System Username"
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
                                                    <RiAdminLine style={{ color: '#9CA3AF' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="Master Password"
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
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 1, py: 1.5, fontSize: '1rem',
                                            background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                                            boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
                                            '&:hover': { background: 'linear-gradient(135deg, #0284C7, #0369A1)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(14,165,233,0.4)' },
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Authenticate'}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Admin?{' '}
                            <Link
                                component="button"
                                onClick={() => navigate('/')}
                                sx={{ color: '#0EA5E9', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
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

export default SuperAdminLogin;
