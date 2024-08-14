import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/components/Loading/fullScreen";
import { LOGIN_URL } from "@/config";
import { ElMessage } from "element-plus";
import { ReqPage, RequestPage, ResPage, ResultData } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
import { checkStatus } from "./helper/checkStatus";
import { AxiosCanceler } from "./helper/axiosCancel";
import { useUserStore } from "@/stores/modules/user";
import router from "@/routers";
import { isNumber } from "@/utils/is";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean;
  cancel?: boolean;
}

const axiosCanceler = new AxiosCanceler();

class BaseRequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // instantiation
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // const userStore = useUserStore();
        // 重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
        config.cancel ??= true;
        config.cancel && axiosCanceler.addPending(config);
        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
        config.loading ??= true;
        config.loading && showFullScreenLoading();
        if (config.headers && typeof config.headers.set === "function") {
          // config.headers.set("x-access-token", userStore.token);
          // 改用 session 后，不需要x-access-token了，但是调用 mock api 时还是需要的
          config.headers.set("x-access-token", "bqddxxwqmfncffacvbpkuxvwvqrhln");
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const { data, config } = response;

        const userStore = useUserStore();
        axiosCanceler.removePending(config);
        config.loading && tryHideFullScreenLoading();
        // 登录失效
        if (data && data.code == ResultEnum.OVERDUE) {
          userStore.logout();
          router.replace(LOGIN_URL);
          ElMessage.error(data.msg);
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data && data.code && data.code !== ResultEnum.SUCCESS) {
          ElMessage.error(data.msg);
          return Promise.reject(data);
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        tryHideFullScreenLoading();
        if (response?.status === 401) {
          const userStore = useUserStore();
          userStore.logout();
          checkStatus(response.status, response);
          router.push(LOGIN_URL);
          return Promise.reject(error);
        }
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf("timeout") !== -1) ElMessage.error("请求超时！请您稍后重试");
        if (error.message.indexOf("Network Error") !== -1) ElMessage.error("网络错误！请您稍后重试");
        // 根据服务器响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status, response);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace("/500");
        return Promise.reject(error);
      }
    );
  }
}

class RequestHttp extends BaseRequestHttp {
  getUri(method: string, url: string, params: object = {}): string {
    return this.service.getUri({
      method: method,
      url: url,
      params: params
    });
  }
  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<T> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<T> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }
}

class MockRequestHttp extends BaseRequestHttp {
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }
}

export const mock = new MockRequestHttp({
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_MOCK_API_URL as string,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true
});

const localHttp = new RequestHttp({
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: (window as any).apiPrefix as string,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true
});

export default localHttp;

export const fetchListWithFunc = <T, Params extends RequestPage>(
  list: (params: Params) => Promise<Array<T>>,
  count?: (params: Params) => Promise<number>
): ((params) => Promise<ResultData<ResPage<T>>>) => {
  if (!count) {
    return (params: ReqPage) => {
      return list(toRequestPage(params)).then(data => {
        if (!data) {
          data = [];
        }
        return {
          code: "",
          msg: "",
          data: {
            total: data.length,
            pageNum: 0,
            pageSize: 0,
            list: data
          }
        };
      });
    };
  }

  return (params: ReqPage) => {
    return count(toRequestPage(params)).then(total => {
      return list(toRequestPage(params)).then(data => {
        if (!data) {
          data = [];
        }
        return {
          code: "",
          msg: "",
          data: {
            total: total,
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            list: data
          }
        } as ResultData<ResPage<T>>;
      });
    });
  };
};

export const fetchOffsetLimitListWithFunc = <T, Params extends RequestOffsetLimit>(
  list: (params: Params) => Promise<Array<T>>,
  count?: (params: Params) => Promise<number>
): ((params) => Promise<ResultData<ResPage<T>>>) => {
  if (!count) {
    return (params: ReqPage) => {
      return list(toReqOffsetLimit(params)).then(data => {
        if (!data) {
          data = [];
        }
        return {
          code: "",
          msg: "",
          data: {
            total: data.length,
            pageNum: 0,
            pageSize: 0,
            list: data
          }
        };
      });
    };
  }

  return (params: ReqPage) => {
    return count(toReqOffsetLimit(params)).then(total => {
      return list(toReqOffsetLimit(params)).then(data => {
        if (!data) {
          data = [];
        }
        return {
          code: "",
          msg: "",
          data: {
            total: total,
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            list: data
          }
        } as ResultData<ResPage<T>>;
      });
    });
  };
};

export const wrapObjectResultWithFunc = <T>(
  list: (params) => Promise<Partial<T>>
): ((params) => Promise<ResultData<Partial<T>>>) => {
  return params => {
    return list(params).then(data => {
      if (!data) {
        data = {};
      }
      return {
        code: "",
        msg: "",
        data: data
      };
    });
  };
};

export const wrapArrayResultWithFunc = <T>(list: (params) => Promise<T[]>): ((params) => Promise<ResultData<T[]>>) => {
  return params => {
    return list(params).then(data => {
      if (!data) {
        data = [];
      }
      return {
        code: "",
        msg: "",
        data: data
      };
    });
  };
};

// 更新一个对象
export const updateObject = <T>(url: string, params: { id: any; [key: string]: any }): Promise<T> => {
  let id: string = params.id.toString();
  if (isNumber(params.id)) {
    id = params.id.toFixed(0);
  }
  return localHttp.put<T>(url + "/" + id, params);
};

export interface ObjectInstance {
  id: any;
  [key: string]: any;
}

export const runMethodForObject = <T>(url: string, methodName: string, params: ObjectInstance): Promise<T> => {
  let id: string = params.id.toString();
  if (isNumber(params.id)) {
    id = params.id.toFixed(0);
  }
  return localHttp.put<T>(url + "/" + id + methodName, params);
};

export const deleteObject = <T>(url: string, params: { id: any; [key: string]: any }): Promise<T> => {
  let id: string = params.id.toString();
  if (isNumber(params.id)) {
    id = params.id.toFixed(0);
  }
  return localHttp.delete(url + "/" + id, params);
};

export function toRequestPage<InParams extends ReqPage, OutParams extends RequestPage>(params: InParams): OutParams {
  let { pageNum, pageSize, ...restParams } = params;
  let result: OutParams = {
    page_index: pageNum,
    page_size: pageSize,
    ...restParams
  } as unknown as OutParams;
  return result;
}

export function toReqOffsetLimit<InParams extends ReqPage, OutParams extends RequestOffsetLimit>(params: InParams): OutParams {
  let { pageNum, pageSize, ...restParams } = params;
  if (!pageSize && pageSize <= 0) {
    pageSize = 12;
  }
  if (pageNum && pageNum > 0) {
    pageNum = pageNum - 1;
  } else {
    pageNum = 0;
  }
  const offset = pageNum * pageSize;
  let result: OutParams = {
    offset: offset,
    limit: pageSize,
    ...restParams
  } as unknown as OutParams;
  return result;
}

export function pageToOffsetLimit(
  pageNum: number | null | undefined,
  pageSize: number | null | undefined
): { limit: number; offset: number } {
  if (!pageSize || pageSize <= 0) {
    pageSize = 12;
  }
  if (pageNum && pageNum > 0) {
    pageNum = pageNum - 1;
  } else {
    pageNum = 0;
  }

  return { limit: pageSize!, offset: pageNum! * pageSize! };
}

export function toRequestOffsetLimit<InParams extends RequestPage, OutParams extends RequestOffsetLimit>(
  params: InParams
): OutParams {
  let { page_index, page_size, ...restParams } = params;
  const offsetLimit = pageToOffsetLimit(page_index, page_size);

  let result: OutParams = {
    offset: offsetLimit.offset,
    limit: offsetLimit.limit,
    ...restParams
  } as unknown as OutParams;
  return result;
}
