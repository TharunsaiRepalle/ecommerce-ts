import { Request , Response } from "express";
import { CHANGE_QUANTITY_SCHEMA, CREATE_CART_SCHEMA } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { CartItem, Product } from "@prisma/client";
import { prismaClient } from "..";
import { BadRequestException } from "../exceptions/bad-request";

export const addItemToCart = async(req: Request , res : Response) => {
    const validatedData = CREATE_CART_SCHEMA.parse(req.body);
    let product : Product
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch (error) {
        throw new  NotFoundException('Product Not Found', ErrorCode.PROUDCT_NOT_FOUND);
    }

    //TODO: Check for the existence of the same product in user's cart and alter the quantity as required

    const cart = await prismaClient.cartItem.create({
        data : {
            userId : req.user?.id,
            productId: product.id,
            quantity:  validatedData.quantity
        }
    })
    res.json(cart)
}

export const deleteItemFromCart = async(req: Request , res : Response) => {
    //checking if user is deleting his own cart items or not
    let userCart : CartItem
    try{
        userCart = await prismaClient.cartItem.findFirstOrThrow({
            where : {
                id : +req.params.id
            }
        })
    } catch(err) {
        throw new NotFoundException('Cart is Empty', ErrorCode.NOITEMS_IN_CART)
    }

    if(userCart.userId !== req.user?.id) {
        throw new BadRequestException('Cart does not belong to user.', ErrorCode.CART_DOES_NOT_BELONG)
    }

    await prismaClient.cartItem.delete({
        where : {
            id : +req.params.id
        }
    })

    res.json({ success : true})
}

export const changeQuantity = async(req: Request , res : Response) => {
    //Todo : check if user is updated same cart item.
    const validatedData = CHANGE_QUANTITY_SCHEMA.parse(req.body);
    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data :  {
            quantity : validatedData.quantity
        }
    })

    res.json(updatedCart)
}

export const getCart = async(req: Request , res : Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where :{
            userId : req.user?.id
        },
        include: {
            product: true
        }
    })

    res.json(cart)
}