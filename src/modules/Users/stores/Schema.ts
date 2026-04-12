import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required')
        .min(1, 'Username is required')
        .max(50, 'Username too long'),

    firstName: Yup.string()
        .required('First name is required')
        .min(1, 'First name is required')
        .max(50, 'First name too long'),

    lastName: Yup.string()
        .required('Last name is required')
        .min(1, 'Last name is required')
        .max(50, 'Last name too long'),

    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .notRequired(),

    address: Yup.string()
        .max(200, 'Address too long'),

    password: Yup.string().when('$isCreate', {
        is: true,
        then: (schema) => schema
            .required('Password is required')
            .min(4, 'Password must be at least 4 characters')
            .max(100, 'Password too long'),
        otherwise: (schema) => schema
            .min(4, 'Password must be at least 4 characters')
            .max(100, 'Password too long')
    })
});
