# WebView2 + React TypeScript + gRPC アプリケーション

このプロジェクトは、C# WPF WebView2、React TypeScript、そしてgRPCを組み合わせたモダンなデスクトップアプリケーションです。

## プロジェクト構成

```
webview2-react-app/
├── WebView2Desktop.csproj          # WPF WebView2デスクトップアプリ
├── MainWindow.xaml                 # メインウィンドウのXAML
├── MainWindow.xaml.cs              # メインウィンドウのC#コード
├── GrpcService/                    # gRPCサーバー
│   ├── Protos/
│   │   └── user.proto              # Protocol Buffers定義
│   ├── Services/
│   │   └── UserService.cs          # gRPCユーザーサービス
│   └── Program.cs                  # gRPCサーバーエントリポイント
├── webview2-react-app/             # .NET WebAPIバックエンド（REST）
│   └── WebView2Api/
│       ├── Controllers/
│       │   └── UsersController.cs  # ユーザー管理API
│       └── Program.cs              # WebAPIエントリポイント
└── frontend/                       # React TypeScriptフロントエンド
    ├── src/
    │   ├── components/
    │   │   ├── UserList.tsx        # REST APIユーザー一覧
    │   │   └── GrpcUserList.tsx    # gRPCユーザー一覧
    │   ├── services/
    │   │   ├── api.ts             # REST API通信サービス
    │   │   └── grpcClient.ts      # gRPC通信サービス
    │   └── types/
    │       └── User.ts            # ユーザー型定義
    └── package.json
```

## 機能

### gRPCサーバー (C# .NET)
- Protocol Buffersベースの型安全な通信
- ユーザー管理gRPCサービス（CRUD操作）
- gRPC-Web対応（ブラウザからの接続）
- JSON Transcoding対応

### REST APIバックエンド (.NET WebAPI)
- ユーザー管理API（CRUD操作）
- CORS設定（React開発サーバー対応）
- Swagger UI対応

### フロントエンド (React TypeScript)
- gRPC/REST API切り替え機能
- ユーザー一覧表示
- ユーザー追加機能
- ユーザー削除機能
- 両方の通信方式に対応
- レスポンシブデザイン

### デスクトップアプリ (WPF WebView2)
- Reactアプリの表示
- ナビゲーション制御
- 更新機能
- エラーハンドリング

## セットアップと実行

### 1. gRPCサーバーの起動（推奨）

```bash
cd GrpcService
dotnet run
```

gRPCサーバーは `http://localhost:5181` で起動します。

### 2. REST APIバックエンドの起動（オプション）

```bash
cd webview2-react-app/WebView2Api
dotnet run
```

REST APIは `http://localhost:5262` で起動します。

### 3. Reactフロントエンドの起動

```bash
cd frontend
npm install
npm start
```

Reactアプリは `http://localhost:3000` で起動します。

### 4. WebView2デスクトップアプリの起動

```bash
# プロジェクトルートで
dotnet run
```

または Visual Studio/Visual Studio Codeでプロジェクトを開いて実行。

## 使用方法

1. gRPCサーバー（またはREST API）とReactアプリを起動
2. WebView2デスクトップアプリを起動
3. 「Reactアプリを開く」ボタンをクリック
4. WebView2内でReactアプリが表示される
5. アプリ内で「gRPC」と「REST API」を切り替え可能
6. ユーザー管理機能を使用可能

## API エンドポイント

### gRPC サービス
- `UserService.GetUsers` - ユーザー一覧取得
- `UserService.GetUser` - 特定ユーザー取得
- `UserService.CreateUser` - ユーザー作成
- `UserService.UpdateUser` - ユーザー更新
- `UserService.DeleteUser` - ユーザー削除

### REST API
- `GET /api/users` - ユーザー一覧取得
- `GET /api/users/{id}` - 特定ユーザー取得
- `POST /api/users` - ユーザー作成
- `PUT /api/users/{id}` - ユーザー更新
- `DELETE /api/users/{id}` - ユーザー削除

## 必要な環境

- .NET 6.0 以上
- Node.js 16.0 以上
- WebView2 Runtime（Windows 10/11に標準搭載）

## 注意事項

- デスクトップアプリを起動する前に、バックエンドAPIとReactアプリを先に起動してください
- API通信はHTTPS証明書の警告が出る場合があります（開発環境）
- WebView2は最新のChromiumエンジンを使用します