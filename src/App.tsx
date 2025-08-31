import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'jotai'
import Router from './router'

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  )
}

export default App
