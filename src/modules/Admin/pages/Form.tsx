import React from 'react';
import {
    Box,
    Button,
    TextField,
    Paper,
    Typography,
    Stack
} from '@mui/material';
import { Formik, Form } from 'formik';
import { adminValidationSchema } from '../stores/Schema';
import type { AdminFormValues } from '../stores/Types';

interface AdminFormProps {
    initialValues: AdminFormValues;
    onSubmit: (values: AdminFormValues) => Promise<void>;
    mode: 'create' | 'edit' | 'view';
    onCancel: () => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ initialValues, onSubmit, mode, onCancel }) => {
    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {mode === 'create' ? 'Create Admin' : mode === 'edit' ? 'Edit Admin' : 'View Admin'}
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={isCreateMode ? adminValidationSchema : adminValidationSchema}
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
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    disabled={isViewMode}
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
                                    label="Phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                    disabled={isViewMode}
                                    required
                                />
                                {!isViewMode && (
                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                        disabled={isViewMode}
                                        required={isCreateMode}
                                    />
                                )}
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

export default AdminForm;
