import { AxiosError } from "axios";

interface IErrorCallback {
    (error: AxiosError<ServerError>, errorMessage?: string | undefined):void
}

interface ServerError {
    message: string;
    code: number;
    [key:string]: any
}

export {IErrorCallback, ServerError}