import React, { useState, useEffect } from 'react';
import { User, CreateUserRequest } from '../types/User';
import { userApi } from '../services/api';
import './UserList.css';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({ name: '', email: '' });

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
      await userApi.createUser(newUser);
      setNewUser({ name: '', email: '' });
      setShowForm(false);
      await loadUsers();
    } catch (err) {
      setError('ユーザーの作成に失敗しました');
      console.error('Error creating user:', err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('このユーザーを削除しますか？')) return;

    try {
      await userApi.deleteUser(id);
      await loadUsers();
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
        <h1>ユーザー管理システム</h1>
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
            <button 
              className="delete-button"
              onClick={() => handleDeleteUser(user.id)}
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;