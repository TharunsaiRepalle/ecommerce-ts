
import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { SIGNUP_SCHEMA } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signUp = async (req: Request, res: Response) => {
    SIGNUP_SCHEMA.parse(req.body)
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } })
    if (user) {
        new BadRequestException('User are Alredy Exists!', ErrorCode.USER_ALREADY_EXIST)
    }

    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    res.json(user)
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } })
    if (!user) {
        throw new NotFoundException("User not Found.", ErrorCode.USER_NOT_FOUND)
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestException('Incorrect Password.', ErrorCode.INCORRECT_PASSWORD)
    }
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({ user, token })
}

export const me = async (req: Request, res: Response) => {
   res.json(req.user)
}