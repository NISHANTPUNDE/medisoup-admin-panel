import React from 'react';
import {
    Box,
    Button,
    TextField,
    Paper,
    Typography,
    Grid
} from '@mui/material';
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

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'View User'}
                </Typography>

                <Formik
                    initialValues={initialValues}
                    validationSchema={userValidationSchema}
                    onSubmit={onSubmit}
                    context={{ isCreate: isCreateMode }}
                    enableReinitialize
                >
                    {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
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
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        label="Email"
                                        type="email"
                                        value={values.email || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                        disabled={isViewMode}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
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
                                </Grid>

                                <Grid item xs={12} md={6}>
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
                                </Grid>

                                <Grid item xs={12} md={6}>
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
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        name="address"
                                        label="Address"
                                        value={values.address || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.address && Boolean(errors.address)}
                                        helperText={touched.address && errors.address}
                                        disabled={isViewMode}
                                    />
                                </Grid>

                                {!isViewMode && (
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            label={isCreateMode ? "Password" : "Password (leave blank to keep current)"}
                                            type="password"
                                            value={values.password || ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                            required={isCreateMode}
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12}>
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
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default UserForm;
