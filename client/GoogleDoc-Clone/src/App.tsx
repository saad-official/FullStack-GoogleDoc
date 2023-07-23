import './App.css'
import { Routes, Route , Navigate } from 'react-router-dom'; 
import TextEditor from './Components/TextEditor'
import { v4 as uuidV4 } from 'uuid';
function App() {

  return (
   
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        <Route path="/documents/:id" element={<TextEditor />} />
    </Routes>
  )
}

export default App
