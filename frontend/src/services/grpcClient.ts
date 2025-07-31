// gRPCサーバーのURL
const GRPC_SERVER_URL = 'http://localhost:5181';

// ユーザーの型定義
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

// リクエスト・レスポンスの型定義
export interface GetUsersRequest {}

export interface GetUsersResponse {
  users: User[];
  success: boolean;
  message: string;
}

export interface GetUserRequest {
  id: number;
}

export interface GetUserResponse {
  user?: User;
  success: boolean;
  message: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse {
  user?: User;
  success: boolean;
  message: string;
}

export interface UpdateUserRequest {
  id: number;
  name: string;
  email: string;
}

export interface UpdateUserResponse {
  user?: User;
  success: boolean;
  message: string;
}

export interface DeleteUserRequest {
  id: number;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

// 簡易gRPCクライアント（Fetch APIを使用）
class UserServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getUsers(): Promise<GetUsersResponse> {
    const response = await fetch(`${this.baseUrl}/UserService/GetUsers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const response = await fetch(`${this.baseUrl}/UserService/GetUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await fetch(`${this.baseUrl}/UserService/CreateUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const response = await fetch(`${this.baseUrl}/UserService/UpdateUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    const response = await fetch(`${this.baseUrl}/UserService/DeleteUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

// クライアントインスタンスをエクスポート
export const userServiceClient = new UserServiceClient(GRPC_SERVER_URL);