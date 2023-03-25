import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        primary: {
          main: '#90CAF9', // A soft shade of blue
        },
        secondary: {
          main: '#FFCC80', // A soft shade of orange
        },
        error: {
          main: '#ef9a9a', // A soft shade of red
        },
        background: {
          default: '#838383 ', // A dark shade of blue-grey for the background
          paper: '#D3D3D3', // A slightly lighter shade of blue-grey for paper elements
        },
        text: {
          primary: '#ECEFF1', // Light text for better contrast on dark backgrounds
          secondary: '#B0BEC5', // Slightly darker text for secondary content
        },
      },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "3rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners for a modern look
  },components: {
    MuiCssBaseline: {
        styleOverrides: {
          html: {
            backgroundColor: '#838383', // Set the background color of the html element to match the theme's background
            margin: 0, // Remove any margin around the html element
            padding: 0, // Remove any padding around the html element
          },
          body: {
            backgroundColor: '#838383', // Set the background color of the body element to match the theme's background
            margin: 0, // Remove any margin around the body element
            padding: 0, // Remove any padding around the body element
          },
        },
      },
    },
});
export default darkTheme;
