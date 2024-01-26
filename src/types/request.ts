interface IAxiosConfig {
    baseURL?: string
    timeout?: number
    headers?: {[key:string]: any}
    [key:string]: any
}

interface IRequestOptions {
    headers?: {[key:string]: any}
    token?: string
    userAgent?: string
    cookies?: string
    errorMessage?: string
    [key:string]: any
}

interface ISendRequestOptions extends IRequestOptions{
    url: string
    method: 'delete' | 'get' | 'patch' | 'post' | 'put'
    [key:string]: any
}

export {IAxiosConfig, ISendRequestOptions}