import * as Yup from 'yup';

export const adminValidationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    firstName: Yup.string()
        .required('First name is required'),
    lastName: Yup.string()
        .required('Last name is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .notRequired(),
    userLimit: Yup.number()
        .min(1, 'Must be at least 1')
        .integer('Must be a whole number')
        .notRequired(),
    password: Yup.string()
        .when('$isCreate', {
            is: true,
            then: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters'),
            otherwise: (schema) => schema.notRequired()
        })
});