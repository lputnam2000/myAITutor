import { useContext, useState } from 'react';
import { DataTetherContext } from '../components/DataTetherProvider';

function TestPage() {
  const { socket, variableState } = useContext(DataTetherContext) || {};
  const [inputData, setInputData] = useState('');

  const handleInputDataChange = (event) => {
    setInputData(event.target.value);
  };

  const handleSendData = () => {
    if (socket) {
      socket.emit('send_data', inputData);
    }
  };

  return (
    <div>
      <h1>Test Page</h1>
      <p>Variable State: {variableState}</p>
      <input type="text" value={inputData} onChange={handleInputDataChange} />
      <button onClick={handleSendData}>Send Data</button>
    </div>
  );
}

export default TestPage;
