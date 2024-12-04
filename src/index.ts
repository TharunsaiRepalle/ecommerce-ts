import express , { Express , Request , Response} from 'express'
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';

const app: Express = express();

app.use(express.json())

app.use('/api', rootRouter);


export const prismaClient = new PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address : {
            formattedAddress: {
                needs : {
                    lineone: true,
                    linetwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute:(address) => {
                    return `${address.lineone}, ${address.linetwo}, ${address.city}, ${address.country}, ${address.pincode}.`
                }
            } 
        }
    }
})

// .$extends({
//     query: {
//         user: {
//             create({ args , query}) {
//                 args.data = SIGNUP_SCHEMA.parse(args.data)
//                 return query(args)
//             }
//         }
//     }
// });

app.use(errorMiddleware)

app.listen(PORT ,() => {
    console.log(`app is running at PORT: ${PORT}`)
})