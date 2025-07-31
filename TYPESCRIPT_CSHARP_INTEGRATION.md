# TypeScript (React) と C# WebAPI の連携ガイド

## 目次
1. [基本概念](#基本概念)
2. [データ型の対応関係](#データ型の対応関係)
3. [APIエンドポイントの設計](#apiエンドポイントの設計)
4. [TypeScriptでのAPI通信実装](#typescriptでのapi通信実装)
5. [C# WebAPIの実装](#c-webapiの実装)
6. [実装サンプル](#実装サンプル)
7. [エラーハンドリング](#エラーハンドリング)
8. [ベストプラクティス](#ベストプラクティス)
9. [トラブルシューティング](#トラブルシューティング)

## 基本概念

### フロントエンドとバックエンドの役割

```
┌─────────────────────┐    HTTP Request     ┌─────────────────────┐
│                     │ ──────────────────► │                     │
│  React TypeScript   │                     │   C# WebAPI         │
│  (フロントエンド)     │                     │   (バックエンド)      │
│                     │ ◄────────────────── │                     │
└─────────────────────┘    JSON Response    └─────────────────────┘
```

- **フロントエンド**: ユーザーが操作するUI部分
- **バックエンド**: データの処理、保存、ビジネスロジックを担当
- **API**: フロントエンドとバックエンドを繋ぐ橋渡し

### HTTP通信の基本

```typescript
// GET: データを取得
GET /api/users
→ ユーザー一覧を取得

// POST: データを作成
POST /api/users + データ
→ 新しいユーザーを作成

// PUT: データを更新
PUT /api/users/1 + データ
→ ID=1のユーザーを更新

// DELETE: データを削除
DELETE /api/users/1
→ ID=1のユーザーを削除
```

## データ型の対応関係

TypeScriptとC#でのデータ型の対応を理解することが重要です。

| TypeScript | C# | JSON例 |
|------------|----|----|
| `number` | `int`, `double`, `decimal` | `123`, `45.67` |
| `string` | `string` | `"Hello World"` |
| `boolean` | `bool` | `true`, `false` |
| `Date` | `DateTime` | `"2023-07-31T10:30:00Z"` |
| `interface` | `class` | `{"id": 1, "name": "太郎"}` |
| `Array<T>` | `List<T>`, `T[]` | `[1, 2, 3]` |

### 実例：ユーザーデータの型定義

**TypeScript側 (`types/User.ts`)**
```typescript
export interface User {
  id: number;        // C#のint
  name: string;      // C#のstring
  email: string;     // C#のstring
  createdAt: Date;   // C#のDateTime（JSONでは文字列）
  isActive: boolean; // C#のbool
}
```

**C#側 (User.cs)**
```csharp
public class User
{
    public int Id { get; set; }           // TypeScriptのnumber
    public string Name { get; set; }      // TypeScriptのstring
    public string Email { get; set; }     // TypeScriptのstring
    public DateTime CreatedAt { get; set; } // TypeScriptのDate
    public bool IsActive { get; set; }    // TypeScriptのboolean
}
```

## APIエンドポイントの設計

### RESTful APIの基本原則

```
GET    /api/users      → ユーザー一覧取得
GET    /api/users/{id} → 特定ユーザー取得
POST   /api/users      → ユーザー作成
PUT    /api/users/{id} → ユーザー更新
DELETE /api/users/{id} → ユーザー削除
```

### エンドポイント設計のポイント

1. **統一した命名規則**: 複数形を使用（users, products等）
2. **HTTPメソッドの適切な使用**: CRUD操作に対応
3. **階層構造**: リソースの関係を明確に表現

## TypeScriptでのAPI通信実装

### 1. Axiosの設定

```typescript
// services/api.ts
import axios from 'axios';

// APIのベースURL設定
const API_BASE_URL = 'http://localhost:5262/api';

// Axiosインスタンスの作成
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒でタイムアウト
});

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

### 2. API関数の実装パターン

```typescript
// services/userApi.ts
import { api } from './api';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/User';

export const userApi = {
  // GET: ユーザー一覧取得
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // GET: 特定ユーザー取得
  getUser: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // POST: ユーザー作成
  createUser: async (user: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/users', user);
    return response.data;
  },

  // PUT: ユーザー更新
  updateUser: async (id: number, user: UpdateUserRequest): Promise<void> => {
    await api.put(`/users/${id}`, user);
  },

  // DELETE: ユーザー削除
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
```

### 3. Reactコンポーネントでの使用

```typescript
// components/UserList.tsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';
import { User } from '../types/User';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // コンポーネント読み込み時にユーザー一覧を取得
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userApi.getUsers();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('ユーザーの読み込みに失敗しました');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await userApi.deleteUser(id);
      await loadUsers(); // 削除後にリストを再読み込み
    } catch (err) {
      setError('ユーザーの削除に失敗しました');
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={() => handleDeleteUser(user.id)}>
            削除
          </button>
        </div>
      ))}
    </div>
  );
};
```

## C# WebAPIの実装

### 1. コントローラーの基本構造

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    // データストア（実際の開発ではデータベースを使用）
    private static readonly List<User> Users = new()
    {
        new User { Id = 1, Name = "田中太郎", Email = "tanaka@example.com" },
        new User { Id = 2, Name = "佐藤花子", Email = "sato@example.com" }
    };

    // GET: api/users
    [HttpGet]
    public ActionResult<IEnumerable<User>> GetUsers()
    {
        return Ok(Users);
    }

    // GET: api/users/1
    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        var user = Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
        {
            return NotFound(); // 404エラーを返す
        }
        return Ok(user);
    }

    // POST: api/users
    [HttpPost]
    public ActionResult<User> CreateUser(CreateUserRequest request)
    {
        var newUser = new User
        {
            Id = Users.Max(u => u.Id) + 1, // 新しいIDを生成
            Name = request.Name,
            Email = request.Email
        };
        
        Users.Add(newUser);
        
        // 201 Createdステータスとともに作成されたユーザーを返す
        return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
    }

    // PUT: api/users/1
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, UpdateUserRequest request)
    {
        var user = Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
        {
            return NotFound();
        }

        user.Name = request.Name;
        user.Email = request.Email;

        return NoContent(); // 204 No Contentを返す
    }

    // DELETE: api/users/1
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var user = Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
        {
            return NotFound();
        }

        Users.Remove(user);
        return NoContent();
    }
}
```

### 2. データモデルの定義

```csharp
// Models/User.cs
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class CreateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
```

### 3. CORS設定

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// CORS設定を追加
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Reactの開発サーバー
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// CORS設定を適用
app.UseCors("AllowReactApp");

app.UseRouting();
app.MapControllers();

app.Run();
```

## 実装サンプル

今回のプロジェクトでは以下の構成で実装しています：

### プロジェクト構造
```
webview2-react-app/
├── webview2-react-app/WebView2Api/    # C# WebAPI
│   ├── Controllers/UsersController.cs
│   └── Program.cs
├── frontend/                          # React TypeScript
│   ├── src/
│   │   ├── types/User.ts             # 型定義
│   │   ├── services/api.ts           # API通信
│   │   └── components/UserList.tsx   # UIコンポーネント
│   └── package.json
└── MainWindow.xaml                    # WPF WebView2
```

### 実際の通信フロー

1. **ユーザー一覧の取得**
```
React Component → userApi.getUsers() → GET /api/users → C# Controller → JSON Response → React State
```

2. **ユーザーの作成**
```
React Form → userApi.createUser(data) → POST /api/users → C# Controller → Created User → React State Update
```

3. **ユーザーの削除**
```
React Button → userApi.deleteUser(id) → DELETE /api/users/{id} → C# Controller → 204 No Content → React List Refresh
```

## エラーハンドリング

### TypeScript側のエラーハンドリング

```typescript
const handleApiCall = async () => {
  try {
    const result = await userApi.getUsers();
    setUsers(result);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // サーバーからのエラーレスポンス
        console.error('Server Error:', error.response.status, error.response.data);
        setError(`サーバーエラー: ${error.response.status}`);
      } else if (error.request) {
        // ネットワークエラー
        console.error('Network Error:', error.request);
        setError('ネットワークエラーが発生しました');
      }
    } else {
      // その他のエラー
      console.error('Unexpected Error:', error);
      setError('予期しないエラーが発生しました');
    }
  }
};
```

### C#側のエラーハンドリング

```csharp
[HttpGet("{id}")]
public ActionResult<User> GetUser(int id)
{
    try
    {
        if (id <= 0)
        {
            return BadRequest("無効なIDです"); // 400 Bad Request
        }

        var user = Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
        {
            return NotFound($"ID:{id}のユーザーが見つかりません"); // 404 Not Found
        }

        return Ok(user); // 200 OK
    }
    catch (Exception ex)
    {
        return StatusCode(500, "内部サーバーエラーが発生しました"); // 500 Internal Server Error
    }
}
```

## ベストプラクティス

### 1. 型安全性の確保

```typescript
// ❌ 悪い例：any型の使用
const fetchUser = async (id: any): Promise<any> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ✅ 良い例：具体的な型の使用
const fetchUser = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};
```

### 2. エラーの適切な分類

```typescript
// エラー種別の定義
enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND'
}

// エラー処理の統一化
const handleApiError = (error: any): ApiErrorType => {
  if (!error.response) return ApiErrorType.NETWORK_ERROR;
  
  const status = error.response.status;
  if (status >= 500) return ApiErrorType.SERVER_ERROR;
  if (status === 404) return ApiErrorType.NOT_FOUND;
  if (status >= 400) return ApiErrorType.VALIDATION_ERROR;
  
  return ApiErrorType.SERVER_ERROR;
};
```

### 3. API設計の一貫性

```csharp
// ✅ 統一されたレスポンス形式
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T Data { get; set; }
    public string Message { get; set; }
    public List<string> Errors { get; set; } = new();
}

[HttpGet]
public ActionResult<ApiResponse<List<User>>> GetUsers()
{
    return Ok(new ApiResponse<List<User>>
    {
        Success = true,
        Data = Users,
        Message = "ユーザー一覧を取得しました"
    });
}
```

### 4. 環境別設定

```typescript
// config/api.ts
const getApiBaseUrl = (): string => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'development':
      return 'http://localhost:5262/api';
    case 'production':
      return 'https://api.myapp.com/api';
    default:
      return 'http://localhost:5262/api';
  }
};

export const API_BASE_URL = getApiBaseUrl();
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. CORSエラー
```
Access to XMLHttpRequest at 'http://localhost:5262/api/users' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**解決方法**: C#側でCORS設定を追加
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

#### 2. 型エラー
```typescript
// エラー: Property 'id' does not exist on type 'unknown'
const user = await userApi.getUser(1);
console.log(user.id); // エラー
```

**解決方法**: 適切な型注釈を追加
```typescript
const user: User = await userApi.getUser(1);
console.log(user.id); // OK
```

#### 3. ネットワークエラー
```
Network Error: timeout of 10000ms exceeded
```

**解決方法**: タイムアウト設定の調整またはAPI確認
```typescript
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒に延長
});
```

#### 4. 日付の取り扱い
```typescript
// JSONから受け取った日付文字列をDateオブジェクトに変換
const convertApiUser = (apiUser: any): User => ({
  ...apiUser,
  createdAt: new Date(apiUser.createdAt) // 文字列からDateに変換
});
```

### デバッグのコツ

1. **ブラウザの開発者ツール**: Networkタブでリクエスト/レスポンスを確認
2. **Postman**: API単体でのテスト
3. **ログ出力**: TypeScriptとC#両方でログを出力
4. **Swaggerの活用**: C# WebAPIの仕様確認

```csharp
// Swagger設定（開発環境のみ）
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

このガイドを参考に、TypeScriptとC# WebAPIの連携を理解し、実装を進めてください。何か不明な点があれば、具体的なエラーメッセージや実装内容を教えていただければ、より詳しくサポートいたします。