import { z } from 'zod';

export const CREATE_CART_SCHEMA = z.object({
    productId: z.number(),
    quantity : z.number()
})

export const CHANGE_QUANTITY_SCHEMA  = z.object({
    quantity: z.number()
})