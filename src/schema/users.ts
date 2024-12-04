import { z } from 'zod';

export const SIGNUP_SCHEMA = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const ADDRESS_SCHEMA = z.object({
    lineone: z.string(),
    linetwo: z.string().nullable(),
    pincode: z.string().length(6),
    country: z.string(),
    city: z.string()
})


export const UPDATE_USER_SCHEMA = z.object({
    name: z.string().optional(),
    defaultShippingAddressId: z.number().optional(),
    defaultBillingAddressId : z.number().optional()
})