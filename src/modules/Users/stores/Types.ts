// API Response type matching backend format
export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    data: T | null;
    message: string;
}

// User type
export interface User {
    id: string;
    _id?: string; // MongoDB ID field
    username: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    lockedDeviceId?: string | null;   // null = free to log in from any device
    deviceLockedAt?: string;
    totalCalls: number;
    totalCallDuration: number;
    lastLoginAt?: string;
    loginCount: number;
    createdAt: string;
    updatedAt: string;
}

// User form values
export interface UserFormValues {
    username: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    password?: string;
}

// User list response
export interface UserListResponse {
    users: User[];
    totalCount: number;
    limit: number;
    offset: number;
}
