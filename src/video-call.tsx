// import { SettingsMenu } from '@lib/settings-menu'
import { ConnectionDetails } from '@lib/types'
import {
  formatChatMessageLinks,
  LiveKitRoom,
  LocalUserChoices,
  PreJoin,
  VideoConference,
} from '@livekit/components-react'
import { Room, RoomConnectOptions, RoomOptions, VideoCodec, VideoPresets } from 'livekit-client'
import React from 'react'
import { useParams } from 'react-router-dom'
import { generateRoomId } from './utils/client.utils'
import { SettingsMenu } from '@lib/settings-menu'

const CONN_DETAILS_ENDPOINT = 'http://localhost:3001/api/connection-details'

const videoCall = () => {
  const { roomName } = useParams()
  console.log('roomName', roomName)
  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
    undefined,
  )
  const preJoinDefaults = React.useMemo(() => {
    return {
      username: '',
      videoEnabled: true,
      audioEnabled: true,
    }
  }, [])
  const [connectionDetails, setConnectionDetails] = React.useState<ConnectionDetails | undefined>(
    undefined,
  )
  const handlePreJoinSubmit = React.useCallback(
    async (values: LocalUserChoices) => {
      setPreJoinChoices(values)
      try {
        const url = new URL(CONN_DETAILS_ENDPOINT)
        url.searchParams.append('roomName', roomName || generateRoomId())
        url.searchParams.append('participantName', values.username)

        const connectionDetailsResp = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!connectionDetailsResp.ok) {
          throw new Error(`HTTP error! status: ${connectionDetailsResp.status}`)
        }

        const connectionDetailsData = await connectionDetailsResp.json()

        setConnectionDetails(connectionDetailsData)
      } catch (error) {
        console.error('Failed to fetch connection details:', error)
        handlePreJoinError(error)
      }
    },
    [roomName],
  )
  const handlePreJoinError = React.useCallback((e: any) => console.error(e), [])

  return (
    <main data-lk-theme='default' style={{ height: '100vh' }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <PreJoin
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
            onError={handlePreJoinError}
          />
        </div>
      ) : (
        <VideoConferenceComponent
          connectionDetails={connectionDetails}
          userChoices={preJoinChoices}
          options={{ codec: 'vp8', hq: true }}
        />
      )}
    </main>
  )
}

function VideoConferenceComponent(props: {
  userChoices: LocalUserChoices
  connectionDetails: ConnectionDetails
  options: {
    hq: boolean
    codec: VideoCodec
  }
}) {
  const roomOptions = React.useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = props.options.codec ? props.options.codec : 'vp9'
    if (videoCodec === 'av1' || videoCodec === 'vp9') {
      videoCodec = undefined
    }
    return {
      videoCaptureDefaults: {
        deviceId: props.userChoices.videoDeviceId ?? undefined,
        resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers: props.options.hq
          ? [VideoPresets.h1080, VideoPresets.h720]
          : [VideoPresets.h540, VideoPresets.h216],
        videoCodec,
      },
      audioCaptureDefaults: {
        deviceId: props.userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
    }
  }, [props.userChoices, props.options.hq, props.options.codec])

  const room = React.useMemo(() => new Room(roomOptions), [])

  const connectOptions = React.useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    }
  }, [])

  const handleOnLeave = () => {
    console.log('on leave')
    window.location.reload()
  }
  const handleError = React.useCallback((error: Error) => {
    console.error(error)
    alert(`Encountered an unexpected error, check the console logs for details: ${error.message}`)
  }, [])
  const handleEncryptionError = React.useCallback((error: Error) => {
    console.error(error)
    alert(
      `Encountered an unexpected encryption error, check the console logs for details: ${error.message}`,
    )
  }, [])

  return (
    <>
      <LiveKitRoom
        room={room}
        token={props.connectionDetails.participantToken}
        serverUrl={props.connectionDetails.serverUrl}
        connectOptions={connectOptions}
        video={props.userChoices.videoEnabled}
        audio={props.userChoices.audioEnabled}
        onDisconnected={handleOnLeave}
        onEncryptionError={handleEncryptionError}
        onError={handleError}
      >
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SettingsMenu}
        />
      </LiveKitRoom>
    </>
  )
}

export default videoCall
