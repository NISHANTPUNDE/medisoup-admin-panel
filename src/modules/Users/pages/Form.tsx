import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Paper,
    Typography,
    Stack,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'View User'}
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={isCreateMode ? userValidationSchema : userValidationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                    <Form>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
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
                                />
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
                                    name="phone"
                                    label="Phone (Optional)"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                    disabled={isViewMode}
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
                                />
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
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    disabled={isViewMode}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={onCancel}
                                >
                                    {isViewMode ? 'Back' : 'Cancel'}
                                </Button>
                                {!isViewMode && (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default UserForm;
