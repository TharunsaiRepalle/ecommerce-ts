import { NextFunction , Request , Response } from "express";
import * as jwt from 'jsonwebtoken'
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware =  async( req : Request , res : Response , next : NextFunction) => {
    //1. Extract token from header
    const token = req.headers.authorization;
    //2. If token is not present, throw an error of unauthorized.
    if(!token) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }
    
    try {  
        //3. If token is present, verify that token and extract the payload. 
        const payload = jwt.verify(token, JWT_SECRET) as any;
        //4. To get the user from the payload.
        const user = await prismaClient.user.findFirst({ where : { id : payload.userId}})
        if(!user) {
            next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
        }
        //5. To attach the user to the current request object.
        req.user = user;
        next()
    } catch(err) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }
}

export default authMiddleware;