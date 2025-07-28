# WebView2 + React TypeScript アプリケーション

このプロジェクトは、C# WPF WebView2とReact TypeScriptを組み合わせたデスクトップアプリケーションです。

## プロジェクト構成

```
webview2-react-app/
├── WebView2Desktop.csproj          # WPF WebView2デスクトップアプリ
├── MainWindow.xaml                 # メインウィンドウのXAML
├── MainWindow.xaml.cs              # メインウィンドウのC#コード
├── webview2-react-app/             # .NET WebAPIバックエンド
│   └── WebView2Api/
│       ├── Controllers/
│       │   └── UsersController.cs  # ユーザー管理API
│       └── Program.cs              # WebAPIエントリポイント
└── frontend/                       # React TypeScriptフロントエンド
    ├── src/
    │   ├── components/
    │   │   └── UserList.tsx        # ユーザー一覧コンポーネント
    │   ├── services/
    │   │   └── api.ts              # API通信サービス
    │   └── types/
    │       └── User.ts             # ユーザー型定義
    └── package.json
```

## 機能

### バックエンド (.NET WebAPI)
- ユーザー管理API（CRUD操作）
- CORS設定（React開発サーバー対応）
- Swagger UI対応

### フロントエンド (React TypeScript)
- ユーザー一覧表示
- ユーザー追加機能
- ユーザー削除機能
- API連携
- レスポンシブデザイン

### デスクトップアプリ (WPF WebView2)
- Reactアプリの表示
- ナビゲーション制御
- 更新機能
- エラーハンドリング

## セットアップと実行

### 1. バックエンドAPIの起動

```bash
cd webview2-react-app/WebView2Api
dotnet run
```

APIは `https://localhost:7098` で起動します。

### 2. Reactフロントエンドの起動

```bash
cd frontend
npm install
npm start
```

Reactアプリは `http://localhost:3000` で起動します。

### 3. WebView2デスクトップアプリの起動

```bash
# プロジェクトルートで
dotnet run
```

または Visual Studio/Visual Studio Codeでプロジェクトを開いて実行。

## 使用方法

1. バックエンドAPIとReactアプリを起動
2. WebView2デスクトップアプリを起動
3. 「Reactアプリを開く」ボタンをクリック
4. WebView2内でReactアプリが表示される
5. ユーザー管理機能を使用可能

## API エンドポイント

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