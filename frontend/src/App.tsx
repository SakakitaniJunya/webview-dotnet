import React, { useState } from 'react';
import UserList from './components/UserList';
import GrpcUserList from './components/GrpcUserList';
import './App.css';

function App() {
  const [useGrpc, setUseGrpc] = useState(true);

  return (
    <div className="App">
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setUseGrpc(!useGrpc)}
          style={{
            padding: '10px 20px',
            backgroundColor: useGrpc ? '#007bff' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          {useGrpc ? 'REST APIに切り替え' : 'gRPCに切り替え'}
        </button>
        <p style={{ color: '#666' }}>
          現在の通信方式: {useGrpc ? 'gRPC' : 'REST API'}
        </p>
      </div>
      
      {useGrpc ? <GrpcUserList /> : <UserList />}
    </div>
  );
}

export default App;
