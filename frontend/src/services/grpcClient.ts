import { UserServiceClient } from '../proto/UserServiceClientPb';
import {
  GetUsersRequest,
  GetUsersResponse,
  GetUserRequest,
  GetUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  User
} from '../proto/user_pb';

// gRPCサーバーのURL
const GRPC_SERVER_URL = 'http://localhost:5181';

// gRPC-Webクライアントのインスタンス
const client = new UserServiceClient(GRPC_SERVER_URL);

// TypeScript用の型定義（UIで使用）
export interface UserData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export interface GetUsersResponseData {
  users: UserData[];
  success: boolean;
  message: string;
}

export interface GetUserResponseData {
  user?: UserData;
  success: boolean;
  message: string;
}

export interface CreateUserResponseData {
  user?: UserData;
  success: boolean;
  message: string;
}

export interface UpdateUserResponseData {
  user?: UserData;
  success: boolean;
  message: string;
}

export interface DeleteUserResponseData {
  success: boolean;
  message: string;
}

export interface CreateUserRequestData {
  name: string;
  email: string;
}

export interface UpdateUserRequestData {
  id: number;
  name: string;
  email: string;
}

export interface DeleteUserRequestData {
  id: number;
}

// Protocol BuffersとJavaScriptオブジェクト間の変換ヘルパー
const convertUserFromPb = (user: User): UserData => ({
  id: user.getId(),
  name: user.getName(),
  email: user.getEmail(),
  createdAt: user.getCreatedAt(),
  isActive: user.getIsActive()
});

const convertUserToPb = (userData: UserData): User => {
  const user = new User();
  user.setId(userData.id);
  user.setName(userData.name);
  user.setEmail(userData.email);
  user.setCreatedAt(userData.createdAt);
  user.setIsActive(userData.isActive);
  return user;
};

// gRPCサービスクライアント
export class GrpcUserService {
  async getUsers(): Promise<GetUsersResponseData> {
    return new Promise((resolve, reject) => {
      const request = new GetUsersRequest();
      
      client.getUsers(request, {}, (err, response: GetUsersResponse) => {
        if (err) {
          console.error('gRPC Error:', err);
          reject(new Error(`gRPC通信エラー: ${err.message}`));
          return;
        }

        const users = response.getUsersList().map(convertUserFromPb);
        
        resolve({
          users,
          success: response.getSuccess(),
          message: response.getMessage()
        });
      });
    });
  }

  async getUser(id: number): Promise<GetUserResponseData> {
    return new Promise((resolve, reject) => {
      const request = new GetUserRequest();
      request.setId(id);
      
      client.getUser(request, {}, (err, response: GetUserResponse) => {
        if (err) {
          console.error('gRPC Error:', err);
          reject(new Error(`gRPC通信エラー: ${err.message}`));
          return;
        }

        const user = response.getUser();
        
        resolve({
          user: user ? convertUserFromPb(user) : undefined,
          success: response.getSuccess(),
          message: response.getMessage()
        });
      });
    });
  }

  async createUser(userData: CreateUserRequestData): Promise<CreateUserResponseData> {
    return new Promise((resolve, reject) => {
      const request = new CreateUserRequest();
      request.setName(userData.name);
      request.setEmail(userData.email);
      
      client.createUser(request, {}, (err, response: CreateUserResponse) => {
        if (err) {
          console.error('gRPC Error:', err);
          reject(new Error(`gRPC通信エラー: ${err.message}`));
          return;
        }

        const user = response.getUser();
        
        resolve({
          user: user ? convertUserFromPb(user) : undefined,
          success: response.getSuccess(),
          message: response.getMessage()
        });
      });
    });
  }

  async updateUser(userData: UpdateUserRequestData): Promise<UpdateUserResponseData> {
    return new Promise((resolve, reject) => {
      const request = new UpdateUserRequest();
      request.setId(userData.id);
      request.setName(userData.name);
      request.setEmail(userData.email);
      
      client.updateUser(request, {}, (err, response: UpdateUserResponse) => {
        if (err) {
          console.error('gRPC Error:', err);
          reject(new Error(`gRPC通信エラー: ${err.message}`));
          return;
        }

        const user = response.getUser();
        
        resolve({
          user: user ? convertUserFromPb(user) : undefined,
          success: response.getSuccess(),
          message: response.getMessage()
        });
      });
    });
  }

  async deleteUser(userData: DeleteUserRequestData): Promise<DeleteUserResponseData> {
    return new Promise((resolve, reject) => {
      const request = new DeleteUserRequest();
      request.setId(userData.id);
      
      client.deleteUser(request, {}, (err, response: DeleteUserResponse) => {
        if (err) {
          console.error('gRPC Error:', err);
          reject(new Error(`gRPC通信エラー: ${err.message}`));
          return;
        }
        
        resolve({
          success: response.getSuccess(),
          message: response.getMessage()
        });
      });
    });
  }
}

// エクスポートするクライアントインスタンス
export const grpcUserService = new GrpcUserService();