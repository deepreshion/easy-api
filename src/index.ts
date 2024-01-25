import axios from 'axios'

let api = axios.create()

let errorNotify = (error: Error) => {
    console.log('Ошибка', error)
}

const mountApi = (baseUrl: string, errorCallback: Function) => {
    api = axios.create({
        baseURL: baseUrl,
    })
    errorNotify = errorCallback()
}

const useResponse: IUseResponse = async(data = null, options, errorMessage) => {
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
    console.error(error)
    errorNotify(error)
    const text: string = errorMessage ?? error.response?.data.error
    return null
  }
}

interface IOptionsUseResponse {
    url: string
    method: 'delete' | 'get' | 'patch' | 'post' | 'put'
    [key:string]: any
}

interface IUseResponse {
    // eslint-disable-next-line no-unused-vars
    (data: any | null, options: IOptionsUseResponse, errorMessage?: string | null | undefined): Promise<any>
}

export interface IResponse {
    config: any,
    data: any,
    headers: any,
    request: any,
    status: number,
    statusText: string,
}

interface IBaseApi {
    /* eslint-disable no-unused-vars */
    delete(url: string, data?: any | null, opts?: any): Promise<IResponse>
    get(url: string, params?: any | null, opts?: any,  errorMessage?: string | null): Promise<IResponse>
    patch(url: string, data: any | null, opts?: any): Promise<IResponse>
    post(url: string, data: any | null, opts?: any, errorMessage?: string | null): Promise<IResponse>
    put(url: string, data: any | null, opts?: any): Promise<IResponse>
    /* eslint-disable no-unused-vars */
}

const useApi: IBaseApi = {
  delete(url, data = null, opts = {}) {
    return useResponse(data, {
      method: 'delete',
      url,
      ...opts,
    })
  },

  get(url, params = null, opts = {}, errorMessage) {
    return useResponse(null,
      {
        method: 'get',
        url,
        params,
        ...opts,
      },
      errorMessage
    )
  },

  patch(url, data = null, opts = {}) {
    return useResponse(data, {
      method: 'patch',
      url,
      ...opts,
    })
  },

  post(url, data = null, opts = {}, errorMessage) {
    return useResponse(
      data,
      {
        method: 'post',
        url,
        ...opts,
      },
      errorMessage
    )
  },

  put(url, data = null, opts = {}) {
    return useResponse(data, {
      method: 'put',
      url,
      ...opts,
    })
  },
}

export default useApi
export { api, mountApi }
