import React from 'react';
import './App.css';

const { ipcRenderer } = window.require('electron');

function App() {
  return (
    <div className="App">
      <button onClick={(event) => {
        ipcRenderer.send('noti-ping', new Date());
      }}>Notication Call Test</button>
    </div>
  );
}

export default App;
