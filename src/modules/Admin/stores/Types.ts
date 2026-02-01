// API Response type matching backend format
export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    data: T | null;
    message: string;
}

// Admin type
export interface Admin {
    id: string;
    _id?: string; // MongoDB ID field
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
}

// Admin form values
export interface AdminFormValues {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password?: string;
}

// Admin list response
export interface AdminListResponse {
    admins: Admin[];
    totalCount: number;
    limit: number;
    offset: number;
}
