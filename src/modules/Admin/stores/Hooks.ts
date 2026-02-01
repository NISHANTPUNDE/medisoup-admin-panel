import apiService from '../../../utils/Axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import type { Admin, AdminFormValues, AdminListResponse } from './Types';

const useAdmin = () => {
    const [admin_list, setAdminList] = useState<Admin[]>([]);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [totalCount, setTotalCount] = useState(0);

    const addAdmin = async (values: AdminFormValues) => {
        try {
            const data = {
                username: values.username,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                password: values.password
            };
            const response: Admin = await apiService.post('/api/superadmin/admins', data);
            toast.success('Admin created successfully');
            return response;
        } catch (error: any) {
            toast.error(error.message || 'Failed to create admin');
            throw error;
        }
    };

    const getAdminList = async (page: number = 1, pageSize: number = 10, search?: string) => {
        try {
            const offset = (page - 1) * pageSize;
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const response: AdminListResponse = await apiService.get(
                `/api/superadmin/admins?offset=${offset}&limit=${pageSize}${searchParam}`
            );

            // Map _id to id for frontend consistency
            const adminsWithId = (response.admins || []).map(admin => ({
                ...admin,
                id: admin._id || admin.id
            }));

            setAdminList(adminsWithId);
            setTotalCount(response.totalCount || 0);
            return adminsWithId;
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch admin list');
            throw error;
        }
    };

    const getAdmin = async (id: string) => {
        try {
            const response: Admin = await apiService.get(`/api/superadmin/admins/${id}`);
            // Map _id to id for frontend consistency
            const adminWithId = {
                ...response,
                id: response._id || response.id
            };
            setAdmin(adminWithId);
            return adminWithId;
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch admin');
            throw error;
        }
    };

    const updateAdmin = async (id: string, values: AdminFormValues) => {
        try {
            const data: any = {
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone
            };

            if (values.password) {
                data.password = values.password;
            }

            const response: Admin = await apiService.put(`/api/superadmin/admins/${id}`, data);
            toast.success('Admin updated successfully');
            return response;
        } catch (error: any) {
            toast.error(error.message || 'Failed to update admin');
            throw error;
        }
    };

    const deleteAdmin = async (id: string) => {
        try {
            await apiService.delete(`/api/superadmin/admins/${id}`);
            toast.success('Admin deleted successfully');
            await getAdminList();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete admin');
            throw error;
        }
    };

    const toggleAdminStatus = async (id: string) => {
        try {
            const response: Admin = await apiService.patch(`/api/superadmin/admins/${id}/toggle-status`);
            toast.success(`Admin ${response.isActive ? 'activated' : 'deactivated'} successfully`);
            await getAdminList();
            return response;
        } catch (error: any) {
            toast.error(error.message || 'Failed to toggle admin status');
            throw error;
        }
    };

    return [
        {
            addAdmin,
            getAdminList,
            getAdmin,
            updateAdmin,
            deleteAdmin,
            toggleAdminStatus
        },
        {
            admin_list,
            admin,
            totalCount
        }
    ] as const;
};

export default useAdmin;