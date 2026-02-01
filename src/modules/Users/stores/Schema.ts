import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must not exceed 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

    email: Yup.string()
        .email('Invalid email format'),

    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters'),

    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters'),

    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),

    address: Yup.string()
        .max(200, 'Address must not exceed 200 characters'),

    password: Yup.string().when('$isCreate', {
        is: true,
        then: (schema) => schema
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password must not exceed 100 characters'),
        otherwise: (schema) => schema
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password must not exceed 100 characters')
    })
});
