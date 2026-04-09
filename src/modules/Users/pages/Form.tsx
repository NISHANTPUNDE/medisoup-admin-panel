import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Paper,
    Typography,
    Stack,
    IconButton,
    InputAdornment,
    Divider,
} from '@mui/material';
import { RiEyeLine, RiEyeOffLine, RiUserLine, RiPhoneLine, RiLockPasswordLine, RiMapPinLine } from 'react-icons/ri';
import { Formik, Form } from 'formik';
import { userValidationSchema } from '../stores/Schema';
import type { UserFormValues } from '../stores/Types';

interface UserFormProps {
    initialValues: UserFormValues;
    onSubmit: (values: UserFormValues) => Promise<void>;
    mode: 'create' | 'edit' | 'view';
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues, onSubmit, mode, onCancel }) => {
    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    const [showPassword, setShowPassword] = useState(false);

    const modeLabel = mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'User Details';
    const modeColor = mode === 'view' ? '#6B7280' : '#2563EB';

    return (
        <Paper sx={{ p: 0, overflow: 'hidden' }}>
            {/* Card header */}
            <Box sx={{
                px: 3, py: 2.5,
                borderBottom: '1px solid #E5E7EB',
                display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: `${modeColor}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: modeColor,
                }}>
                    <RiUserLine size={18} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1F2937' }}>{modeLabel}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {mode === 'create'
                            ? 'Fill in the details to create a new user account'
                            : mode === 'edit'
                            ? 'Update user account information'
                            : 'Viewing user account details'}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ p: 3 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={userValidationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                >
                    {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                        <Form>
                            <Stack spacing={3}>
                                {/* Account Info Section */}
                                <Box>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
                                        Account Information
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                                        <TextField
                                            fullWidth
                                            name="username"
                                            label="Username"
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.username && Boolean(errors.username)}
                                            helperText={touched.username && errors.username}
                                            disabled={isViewMode || mode === 'edit'}
                                            required
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><RiUserLine style={{ color: '#9CA3AF' }} /></InputAdornment>,
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            name="phone"
                                            label="Phone (Optional)"
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.phone && Boolean(errors.phone)}
                                            helperText={touched.phone && errors.phone}
                                            disabled={isViewMode}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><RiPhoneLine style={{ color: '#9CA3AF' }} /></InputAdornment>,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ borderColor: '#F3F4F6' }} />

                                {/* Personal Info Section */}
                                <Box>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
                                        Personal Details
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                                        <TextField
                                            fullWidth
                                            name="firstName"
                                            label="First Name"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.firstName && Boolean(errors.firstName)}
                                            helperText={touched.firstName && errors.firstName}
                                            disabled={isViewMode}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            name="lastName"
                                            label="Last Name"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.lastName && Boolean(errors.lastName)}
                                            helperText={touched.lastName && errors.lastName}
                                            disabled={isViewMode}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            name="address"
                                            label="Address"
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.address && Boolean(errors.address)}
                                            helperText={touched.address && errors.address}
                                            disabled={isViewMode}
                                            sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><RiMapPinLine style={{ color: '#9CA3AF' }} /></InputAdornment>,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ borderColor: '#F3F4F6' }} />

                                {/* Security Section */}
                                <Box>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
                                        Security
                                    </Typography>
                                    <Box sx={{ maxWidth: { md: '50%' } }}>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            label={isCreateMode ? 'Password' : 'Password (leave blank to keep current)'}
                                            type={showPassword ? 'text' : 'password'}
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                            disabled={isViewMode}
                                            required={isCreateMode}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><RiLockPasswordLine style={{ color: '#9CA3AF' }} /></InputAdornment>,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" disabled={isViewMode}>
                                                            {showPassword ? <RiEyeOffLine style={{ color: '#9CA3AF' }} /> : <RiEyeLine style={{ color: '#9CA3AF' }} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Box>

                                {/* Actions */}
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1, borderTop: '1px solid #F3F4F6' }}>
                                    <Button variant="outlined" onClick={onCancel} sx={{ borderRadius: '10px', px: 3 }}>
                                        {isViewMode ? 'Back' : 'Cancel'}
                                    </Button>
                                    {!isViewMode && (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting}
                                            sx={{
                                                borderRadius: '10px', px: 3,
                                                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                                                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                                                '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)' },
                                            }}
                                        >
                                            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
                                        </Button>
                                    )}
                                </Box>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Paper>
    );
};

export default UserForm;
