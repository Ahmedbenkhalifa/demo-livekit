import { useNavigate } from 'react-router-dom'
import { generateRoomId } from './utils/client.utils'
import '@styles/styles.css'

export default function DemoMeetingTab() {
  const navigate = useNavigate()
  const startMeeting = () => {
    navigate(`/room/${generateRoomId()}`)
  }
  return (
    <main className={'main'} data-lk-theme='default'>
      <div className='tabContent'>
        <img src='/livekit-meet-home.svg' alt='LiveKit Meet' width='360' height='45' />
        <h2 style={{ margin: 0 }}>Its a demo meeting app</h2>
        <button style={{ marginTop: '1rem' }} className='lk-button' onClick={startMeeting}>
          Start Meeting
        </button>
      </div>
    </main>
  )
}
