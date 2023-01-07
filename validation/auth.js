import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Wrong e-mail').isEmail(),
    body('password', 'Password must be longer').isLength({min: 5}),
    body('fullName', 'Wrong name').isLength({min: 3}),
    body('avatarUrl', 'Wrong Url').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Wrong e-mail').isEmail(),
    body('password', 'Min 5 symbol').isLength({ min: 5 }),
];


export const postCreateValidation = [
    body('title', 'Write title of the post').isLength({ min: 3 }).isString(),
    body('text', 'Write a post').isLength({ min: 3 }).isString(),
    body('tags', 'Wrong tag').optional().isString(),
    body('imageUrl', 'Wrong url of image').optional().isString(),
]