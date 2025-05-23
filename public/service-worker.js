self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: '/favicon-32x32.png',
    badge: '/favicon-32x32.png',
    vibrate: [200, 100, 200],
  }

  event.waitUntil(self.registration.showNotification('SpeakDuo Event', options))
})
