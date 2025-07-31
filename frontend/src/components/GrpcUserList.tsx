import React, { useState, useEffect } from 'react';
import { 
  UserData, 
  CreateUserRequestData, 
  grpcUserService 
} from '../services/grpcClient';
import './UserList.css';

const GrpcUserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequestData>({ name: '', email: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await grpcUserService.getUsers();
      
      if (response.success) {
        setUsers(response.users);
        setError(null);
      } else {
        setError(response.message || 'ユーザーの読み込みに失敗しました');
      }
    } catch (err) {
      setError('gRPCサーバーとの通信に失敗しました');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
      const response = await grpcUserService.createUser(newUser);
      
      if (response.success) {
        setNewUser({ name: '', email: '' });
        setShowForm(false);
        await loadUsers();
      } else {
        setError(response.message || 'ユーザーの作成に失敗しました');
      }
    } catch (err) {
      setError('ユーザーの作成に失敗しました');
      console.error('Error creating user:', err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('このユーザーを削除しますか？')) return;

    try {
      const response = await grpcUserService.deleteUser({ id });
      
      if (response.success) {
        await loadUsers();
      } else {
        setError(response.message || 'ユーザーの削除に失敗しました');
      }
    } catch (err) {
      setError('ユーザーの削除に失敗しました');
      console.error('Error deleting user:', err);
    }
  };

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-list">
      <div className="header">
        <h1>gRPCユーザー管理システム</h1>
        <button 
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'キャンセル' : '新規ユーザー追加'}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={handleCreateUser}>
          <div className="form-group">
            <label>名前:</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>メール:</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <button type="submit">追加</button>
        </form>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p className="user-meta">
              <small>
                作成日: {user.createdAt}<br />
                状態: {user.isActive ? 'アクティブ' : '非アクティブ'}
              </small>
            </p>
            <button 
              className="delete-button"
              onClick={() => handleDeleteUser(user.id)}
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="no-users">
          <p>ユーザーが登録されていません。</p>
        </div>
      )}
    </div>
  );
};

export default GrpcUserList;