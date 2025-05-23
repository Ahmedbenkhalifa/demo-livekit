import { createTheme, responsiveFontSizes } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4681e0',
      contrastText: '#fff',
    },
    secondary: { main: '#ff9641', contrastText: '#38281ED9' },

    background: {
      default: '#131517',
      paper: '#141517',
    },
  },
})

export default responsiveFontSizes(darkTheme)
