// import './App.css'
import './input.css'
import { BrowserRouter } from 'react-router-dom'
import Approutes from './config/routes'
function App() {
  return (
      <div>
        <BrowserRouter>
             <Approutes />
        </BrowserRouter>
      </div>
  )
}

export default App