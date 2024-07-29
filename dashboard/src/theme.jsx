import { blue, teal } from '@mui/material/colors';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#003366', // Deep dark blue for primary elements
          },
          secondary: {
            main: '#004080', // Dark blue for secondary elements
          },
          divider: '#004080', // Dark blue for dividers
          background: {
            default: '#fafcff', // Light, slightly bluish background
            paper: '#ffffff', // White for paper elements
          },
          text: {
            primary: '#001f3f', // Very dark blue for primary text
            secondary: '#003366', // Dark blue for secondary text
          },
        }
      : {
          // palette values for dark mode (if you want to add similar adjustments)
          primary: {
            main: '#001f3f', // Dark blue for primary elements
          },
          secondary: {
            main: '#003366', // Slightly lighter dark blue for secondary elements
          },
          divider: '#003366', // Dark blue for dividers
          background: {
            default: '#002147', // Very dark blue for background
            paper: '#003366', // Dark blue for paper elements
          },
          text: {
            primary: '#ffffff', // White for primary text
            secondary: '#b0b0b0', // Light grey for secondary text
          },
        }),
  },
});
