export function generateRoomId(): string {
  return `${randomString(4)}-${randomString(4)}`
}

export function randomString(length: number): string {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
