// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    id: number;
    username: string;
    nickname: string;
    access_token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface CurrentUser {
    id: number;
    name: string;
    nickname: string;

    [key: string]: any;
  }

  export interface UserRecord {
    id: number;
    name: string;
    nickname: string;
    description: string;
    is_default: boolean;
    disabled: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: any;
  }
}

// 分页请求参数
export interface RequestPage {
  page_index: number;
  page_size: number;
}

// 分页请求参数
export interface RequestOffsetLimit {
  offset: number;
  limit: number;
}

export namespace boo {
  export interface Department {
    id: number;
    parent_id: number;
    name: string;
    order_num: number;
    children?: Department[];
    created_at: string;
    updated_at: string;
    fields: { [key: string]: any };

    [key: string]: any;
  }

  export interface User {
    id: number;
    name: string;
    nickname: string;
    description: string;
    disabled: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: any;
  }

  export interface Role {
    id: number;
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;

    [key: string]: any;
  }

  export interface Employee {
    id: number;
    department_id: number;
    name: string;
    nickname: string;
    fields: { [key: string]: any };
    created_at: string;
    updated_at: string;

    [key: string]: any;
  }

  export interface CurrentUser {
    id: number;
    name: string;
    nickname: string;

    [key: string]: any;
  }
}

export namespace System {
  export interface DictData {
    id: number;
    label: string;
    value: string;
    children?: DictData[];
  }
}
