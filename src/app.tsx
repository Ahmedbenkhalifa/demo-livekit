import VideoCall from './video-call'
import '@livekit/components-styles'
import '@livekit/components-styles/prefabs'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import theme from '@styles/theme'
// import DemoMeetingTab from './demo-meeting-tab'

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DemoMeetingTab />} />
          <Route path='/room/:roomName' element={<VideoCall />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
