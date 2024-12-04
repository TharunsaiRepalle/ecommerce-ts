import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: Request, res: Response) => {
    //1. create a transaction.
    //2. List all cart items and proceed if cart is not empty.
    //3. Calculate the totalamount
    //4. fetch address of the user
    //5. Define computed field for formatted address on order model
    //6. create order and order products.
    //7. create order event.
    //8. empty the cart.

    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user?.id
            },
            include: {
                product: true
            }
        })

        if (cartItems.length === 0) {
            return res.json({ message: "cart is empty" })
        }

        const price = cartItems.reduce((prev, curr) => {
            return prev + (curr.quantity * +curr.product.price)
        }, 0)

        const address = await tx.address.findFirst({
            where: {
                id: req.user?.defaultShippingAddressId
            }
        })

        const order = await tx.order.create({
            data: {
                userId: req.user?.id,
                netAmount: price,
                address: address?.formattedAddress,
                products: {
                    create: cartItems.map(cart => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })

        const orderEvent = await tx.orderEvents.create({
            data: {
                orderId: order.id
            }
        })
        await tx.cartItem.deleteMany({
            where: {
                userId: req.user?.id
            }
        })

        return res.json(order)
    })
}

export const listOrders = async (req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user?.id
        }
    })

    res.json(orders)
}

export const cancelOrder = async (req: Request, res: Response) => {
    //TODO : wrapped inside the transaction. 
    // check if the user is cancelling its own order.
    try {
        const order = await prismaClient.order.update({
            where: {
                id: + req.params.id
            },
            data: {
                status: 'CANCELLED'
            }
        })

        await prismaClient.orderEvents.create({
            data: {
                orderId: order.id,
                status: 'CANCELLED'
            }
        })
        res.json(order)
    } catch (err) {
        throw new NotFoundException('Order not Found', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })

        res.json(order)
    } catch (err) {
        throw new NotFoundException('Order not Found', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async (req: Request, res: Response) => {
    const status = req.query.status
    let whereClause = {}
    if (status) {
        whereClause = {
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +req.query.skip || 0,
        take: 5

    })

    res.json(orders)
}

export const changeOrderStatus = async (req: Request, res: Response) => {
    //TODO: wrap it inside the transactions.
    try {
        const order = await prismaClient.order.update({
            where: {
                id : +req.params.id
            },
            data: {
                status : req.body.status
            }
        })

        await prismaClient.orderEvents.create({
            data : {
                orderId : order.id,
                status: req.body.status
            }
        })

        res.json(order)
    }catch(err) {
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listUserOrders = async (req: Request, res: Response) => {
    let whereClause : any = {
        userId : +req.params.id
    }
    const status = req.query.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +req.query.skip || 0,
        take: 5

    })

    res.json(orders)
}