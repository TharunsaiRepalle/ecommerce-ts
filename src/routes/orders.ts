import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { cancelOrder, changeOrderStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from "../controllers/orders";
import adminMiddleware from "../middlewares/admin";

const orderRoutes: Router = Router()

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));
orderRoutes.get('/', [authMiddleware], errorHandler(listOrders));
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));


orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
orderRoutes.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(changeOrderStatus));
orderRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders));
orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById));

export default orderRoutes