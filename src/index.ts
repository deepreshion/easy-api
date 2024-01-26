import axios, { AxiosInstance } from 'axios'
interface IAxiosConfig {
    baseUrl?: string
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

interface IErrorCallback {
    (error: Error, errorMessage?: string | undefined):void
}

let api = axios.create()

let errorNotify: IErrorCallback = (error, errorMessage) => {
    console.log('Ошибка', error, errorMessage)
}

const mountApi = (config: IAxiosConfig = {}, errorCallback?: IErrorCallback): AxiosInstance => {
    api = axios.create(config)
    if (errorCallback) {
        errorNotify = errorCallback
    }
    return api
}

const sendRequest = async(data: any | null = null, options: ISendRequestOptions):Promise<any> => {
  let response: any = {}
  let headers = options?.headers || {}
  headers = {
    ...headers,
    'Content-Type': 'application/json; charset=utf-8',
    ...options.token && {
      'Authorization': `Bearer ${options.token}`,
    },
    ...options.userAgent && {
      'User-Agent': options.userAgent,
    },
    ...options.cookies && {
      'Cookie': options.cookies,
    },
  }

  if (options.method !== 'get' && data) {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      headers = { ...headers, 'Content-Type': 'multipart/form-data' }
    }
  }

  try {
    response = await api( {
      ...options,
      headers: headers,
      data,
    })
    return response
  } catch (error: any) {
    // обработка ошибок
    errorNotify(error, options.errorMessage)

    return null
  }
}

export interface IResponse {
    config: any,
    data: any,
    headers: any,
    request: any,
    status: number,
    statusText: string,
}

const ezApi = {
  delete(url: string, data: any | null = null, opts = {}):Promise<IResponse> {
    return sendRequest(data, {
      method: 'delete',
      url,
      ...opts,
    })
  },

  get(url: string, params: {[key:string]: any} | null = null, opts = {}):Promise<IResponse> {
    return sendRequest(null,
      {
        method: 'get',
        url,
        params,
        ...opts,
      },
    )
  },

  patch(url: string, data: any | null = null, opts = {}):Promise<IResponse> {
    return sendRequest(data, {
      method: 'patch',
      url,
      ...opts,
    })
  },

  post(url: string, data: FormData | any | null = null, opts = {}):Promise<IResponse> {
    return sendRequest(
      data,
      {
        method: 'post',
        url,
        ...opts,
      },
    )
  },

  put(url: string, data: any | null = null, opts = {}):Promise<IResponse> {
    return sendRequest(data, {
      method: 'put',
      url,
      ...opts,
    })
  },
}

export default ezApi
export { api, mountApi }
