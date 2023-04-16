import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red } from '@mui/material/colors';



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
  },
  typography: {
    fontFamily: [
      'Pro_Sorce_Code', 'Caveat',

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
          }
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
