import { useContext, useState, useEffect} from 'react';
import { DataTetherContext } from '../components/DataTetherProvider';

function TestPage() {
  const { socket, variableState, addCallback, removeCallback} = useContext(DataTetherContext) || {};
  const [inputData, setInputData] = useState('');
  const [message, setMessage] = useState('');

  useEffect(()=>{
    addCallback((data)=>{
        console.log("callback called: ", data)
        setMessage(data)
    })
    }  
  ,[])

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
      <p>Variable State: <span>{variableState}</span></p>
      <input type="text" value={inputData} onChange={handleInputDataChange} />
      <div>{'Message: ' + message}</div>
      <button onClick={handleSendData}>Send Data</button>
    </div>
  );
}

export default TestPage;
