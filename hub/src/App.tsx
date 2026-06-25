import { useState, useEffect } from 'react'
import './styles/hub.css'
import { BootScreen } from './components/BootScreen'
import { HubShell } from './components/HubShell'

function App() {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooted(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="hub-container">
      {!booted ? (
        <BootScreen onComplete={() => setBooted(true)} />
      ) : (
        <HubShell />
      )}
    </div>
  )
}

export default App
