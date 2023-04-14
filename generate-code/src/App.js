import { Space } from 'antd';
import Sider from './blocks/Sider';
import Main from './blocks/Main';
import Toolbar from './blocks/Toolbar';

import './blocks/index.scss';
import 'antd/dist/reset.css';

function App() {
  return (
    <div className="App">
      <Space size={[0, 0]} style={{ width: '100%' }}>
        <Sider />
        <Main />
        <Toolbar />
      </Space>
    </div>
  );
}

export default App;
