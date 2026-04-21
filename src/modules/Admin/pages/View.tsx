import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAdmin from '../stores/Hooks';
import AdminForm from './Form';
import type { AdminFormValues } from '../stores/Types';
import { CircularProgress, Box } from '@mui/material';
import { DEFAULT_ADMIN_USER_LIMIT } from '../../../constants/admin';

const AdminView = () => {
    const { id, mode } = useParams<{ id: string; mode: 'create' | 'edit' | 'view' }>();
    const navigate = useNavigate();
    const [actions] = useAdmin();
    const { getAdmin, addAdmin, updateAdmin } = actions;
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<AdminFormValues>({
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        userLimit: DEFAULT_ADMIN_USER_LIMIT,
        password: ''
    });

    useEffect(() => {
        if (id && id !== 'new') {
            loadAdmin();
        } else {
            setLoading(false);
        }
    }, [id]);

    const loadAdmin = async () => {
        try {
            setLoading(true);
            if (id) {
                const admin = await getAdmin(id);
                setInitialValues({
                    username: admin.username,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    phone: admin.phone || '',
                    userLimit: admin.userLimit ?? DEFAULT_ADMIN_USER_LIMIT,
                    password: admin.plainPassword || ''
                });
            }
        } catch (error: any) {
            console.error('Error loading admin:', error);
            navigate('/admins');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: AdminFormValues) => {
        try {
            if (mode === 'create') {
                await addAdmin(values);
            } else if (mode === 'edit' && id) {
                await updateAdmin(id, {
                    ...values,
                    password: values.password && values.password !== initialValues.password ? values.password : ''
                });
            }
            navigate('/admins');
        } catch (error: any) {
            console.error('Error saving admin:', error);
            // Error toast is already shown in the hook
        }
    };

    const handleCancel = () => {
        navigate('/admins');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AdminForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            mode={mode || 'view'}
            onCancel={handleCancel}
        />
    );
};

export default AdminView;
