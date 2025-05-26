// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff3e6c', // Change this to your desired primary color
      // light: will be calculated from main if not provided
      // dark: will be calculated from main if not provided
      // contrastText: will be calculated to contrast with main
    },
  },
  components: {
    // You can add component-specific overrides here if needed
  }
});

export default theme;