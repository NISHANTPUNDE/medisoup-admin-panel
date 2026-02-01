import * as Yup from 'yup';

export const adminValidationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    firstName: Yup.string()
        .required('First name is required'),
    lastName: Yup.string()
        .required('Last name is required'),
    phone: Yup.string()
        .required('Phone is required')
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
    password: Yup.string()
        .when('$isCreate', {
            is: true,
            then: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters'),
            otherwise: (schema) => schema.notRequired()
        })
});