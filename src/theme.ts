import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red } from '@mui/material/colors';


const buttonHoverColor = "#7da0b0"
const focusColor = '#14a37f'
const whiteTone = "#e0e0e0"
const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      main: '#f0f4c3',
    },
    secondary: {
      main: '#aed581',
    },
    error: {
      main: red.A400,
    },
    common: {
      appRedColor: "#e57373",
      buttonHoverColor,
      focusColor,
      whiteTone
    }
  },
  typography: {
    fontFamily: [
      'Caveat',

    ].join(','),
    htmlFontSize: 13
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          textTransform: "capitalize"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .Mui-selected': { color: '#bcaaa4', opacity: 1 },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: '#14a37f'
            }
          },
          "& label.Mui-focused": {
            color: '#14a37f'
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: '#14a37f'
          },
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&:disabled": {
            backgroundColor: "#f0f4c3"
          },
          "&:hover": {
            backgroundColor: buttonHoverColor
          },

        },

      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: buttonHoverColor
          },
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '1.5rem'
        }
      }
    }
  }
}))

export default theme;
