import * as React from 'react'
import { Track } from 'livekit-client'
import { useMaybeLayoutContext, MediaDeviceMenu, TrackToggle } from '@livekit/components-react'
import { useKrispNoiseFilter } from '@livekit/components-react/krisp'
import '@styles/styles.css'

export function SettingsMenu(props: any) {
  const layoutContext = useMaybeLayoutContext()

  const settings = React.useMemo(() => {
    return {
      media: { camera: true, microphone: true, label: 'Media Devices', speaker: true },
      effects: { label: 'Effects' },
    }
  }, [])

  const tabs = React.useMemo(
    () => Object.keys(settings).filter((t) => t !== undefined) as Array<keyof typeof settings>,
    [settings],
  )
  const [activeTab, setActiveTab] = React.useState(tabs[0])

  const { isNoiseFilterEnabled, setNoiseFilterEnabled, isNoiseFilterPending } =
    useKrispNoiseFilter()
  console.log(isNoiseFilterPending)
  React.useEffect(() => {
    // enable Krisp by default
    setNoiseFilterEnabled(true)
  }, [])

  return (
    <div className='settings-menu' style={{ width: '100%' }} {...props}>
      <div className={'tabs'}>
        {tabs.map(
          (tab) =>
            settings[tab] && (
              <button
                className={'tab lk-button'}
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={tab === activeTab}
              >
                {settings[tab].label}
              </button>
            ),
        )}
      </div>
      <div className='tab-content'>
        {activeTab === 'media' && (
          <>
            {settings.media && settings.media.camera && (
              <>
                <h3>Camera</h3>
                <section className='lk-button-group'>
                  <TrackToggle source={Track.Source.Camera}>Camera</TrackToggle>
                  <div className='lk-button-group-menu'>
                    <MediaDeviceMenu kind='videoinput' />
                  </div>
                </section>
              </>
            )}
            {settings.media && settings.media.microphone && (
              <>
                <h3>Microphone</h3>
                <section className='lk-button-group'>
                  <TrackToggle source={Track.Source.Microphone}>Microphone</TrackToggle>
                  <div className='lk-button-group-menu'>
                    <MediaDeviceMenu kind='audioinput' />
                  </div>
                </section>
              </>
            )}
            {settings.media && settings.media.speaker && (
              <>
                <h3>Speaker & Headphones</h3>
                <section className='lk-button-group'>
                  <span className='lk-button'>Audio Output</span>
                  <div className='lk-button-group-menu'>
                    <MediaDeviceMenu kind='audiooutput'></MediaDeviceMenu>
                  </div>
                </section>
              </>
            )}
          </>
        )}
        {activeTab === 'effects' && (
          <>
            <h3>Audio</h3>
            <section>
              <label htmlFor='noise-filter'> Enhanced Noise Cancellation</label>
              <input
                type='checkbox'
                id='noise-filter'
                onChange={(ev) => setNoiseFilterEnabled(ev.target.checked)}
                checked={isNoiseFilterEnabled}
                disabled={isNoiseFilterPending}
              ></input>
            </section>
          </>
        )}
      </div>
      <button
        className={'lk-button settingsCloseButton'}
        onClick={() => layoutContext?.widget.dispatch?.({ msg: 'toggle_settings' })}
      >
        Close
      </button>
    </div>
  )
}
