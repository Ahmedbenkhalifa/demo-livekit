import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { register } from '@lib/seviceWorkerRegistration'

register()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
