import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUser from '../stores/Hooks';
import UserForm from './Form';
import type { UserFormValues } from '../stores/Types';
import { toast } from 'react-toastify';
import { CircularProgress, Box } from '@mui/material';

const UserView = () => {
    const { id, mode } = useParams<{ id: string; mode: 'create' | 'edit' | 'view' }>();
    const navigate = useNavigate();
    const [actions, state] = useUser();
    const { getUser, addUser, updateUser } = actions;
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<UserFormValues>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        password: ''
    });

    useEffect(() => {
        if (id && id !== 'new') {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [id]);

    const loadUser = async () => {
        try {
            setLoading(true);
            if (id) {
                const user = await getUser(id);
                setInitialValues({
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    address: user.address,
                    password: ''
                });
            }
        } catch (error: any) {
            console.error('Error loading user:', error);
            toast.error(error.message || 'Failed to load user');
            navigate('/users');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: UserFormValues) => {
        try {
            if (mode === 'create') {
                await addUser(values);
                toast.success('User created successfully');
            } else if (mode === 'edit' && id) {
                await updateUser(id, values);
                toast.success('User updated successfully');
            }
            navigate('/users');
        } catch (error: any) {
            console.error('Error saving user:', error);
            // Error toast is already shown in the hook
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <UserForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            mode={mode || 'view'}
            onCancel={handleCancel}
        />
    );
};

export default UserView;
