import apiService from '../../../utils/Axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import type { User, UserFormValues, UserListResponse } from './Types';

const useUser = () => {
    const [user_list, setUserList] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [totalCount, setTotalCount] = useState(0);

    const addUser = async (values: UserFormValues) => {
        try {
            const data = {
                username: values.username,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                address: values.address,
                password: values.password
            };
            const response: User = await apiService.post('/api/admin/users', data);
            toast.success('User created successfully');
            return response;
        } catch (error: any) {
            toast.error(error.message || 'Failed to create user');
            throw error;
        }
    };

    const getUserList = async (page: number = 1, pageSize: number = 10, search?: string) => {
        try {
            const offset = (page - 1) * pageSize;
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const response: UserListResponse = await apiService.get(
                `/api/admin/users?offset=${offset}&limit=${pageSize}${searchParam}`
            );

            // Map _id to id for frontend consistency
            const usersWithId = (response.users || []).map(user => ({
                ...user,
                id: user._id || user.id
            }));

            setUserList(usersWithId);
            setTotalCount(response.totalCount || 0);
            return usersWithId;
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch user list');
            throw error;
        }
    };

    const getUser = async (id: string) => {
        try {
            const response: User = await apiService.get(`/api/admin/users/${id}`);
            // Map _id to id for frontend consistency
            const userWithId = {
                ...response,
                id: response._id || response.id
            };
            setUser(userWithId);
            return userWithId;
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch user');
            throw error;
        }
    };

    const updateUser = async (id: string, values: UserFormValues) => {
        try {
            const data: any = {
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                address: values.address
            };

            if (values.password) {
                data.password = values.password;
            }

            const response: User = await apiService.put(`/api/admin/users/${id}`, data);
            toast.success('User updated successfully');
            return response;
        } catch (error: any) {
            toast.error(error.message || 'Failed to update user');
            throw error;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await apiService.delete(`/api/admin/users/${id}`);
            toast.success('User deleted successfully');
            // Refresh the list
            await getUserList();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete user');
            throw error;
        }
    };

    const toggleUserStatus = async (id: string) => {
        try {
            await apiService.patch(`/api/admin/users/${id}/toggle-status`);
            toast.success('User status updated');
            // Refresh the list
            await getUserList();
        } catch (error: any) {
            toast.error(error.message || 'Failed to toggle user status');
            throw error;
        }
    };

    const actions = {
        addUser,
        getUserList,
        getUser,
        updateUser,
        deleteUser,
        toggleUserStatus
    };

    const state = {
        user_list,
        user,
        totalCount
    };

    return [actions, state] as const;
};

export default useUser;
