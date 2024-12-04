// error message, HTTP status code , error codes, error

export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;

    constructor(message : string , errorCode: ErrorCode , statusCode : number , errors: any) {
        super(message)
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors   
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXIST,
    INCORRECT_PASSWORD,
    ADDRESS_NOT_FOUND,
    ADDRESS_DOES_NOT_BELONG,
    UNPROCESSIABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    UNAUTHORIZED = 4001,
    PROUDCT_NOT_FOUND = 5001,
    NOITEMS_IN_CART=6001,
    CART_DOES_NOT_BELONG,
    ORDER_NOT_FOUND =7001
}