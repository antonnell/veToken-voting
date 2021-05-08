import { createMuiTheme } from "@material-ui/core/styles";

export const colors = {
  blue: "#2F80ED",
  red: "#ed4337",
  orange: "#ffb347",
  lightBlack: "rgba(0, 0, 0, 0.87)"
};

const coreTheme = {
  shape: {
    borderRadius: "10px"
  },
  typography: {
    fontFamily: [
      "Inter",
      "Arial",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    h1: {
      fontFamily: [
        '"Helvetica Neue"',
        'Inter',
      ],
      fontSize: '60px',
      fontWeight: 700,
      lineHeight: 1.167,
      letterSpacing: '1px'
    },
    h2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.167
    },
    h3: {
      fontFamily: [
        'Inter',
      ],
      fontSize: '20px',
      fontWeight: 600
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.167
    },
    h5: {   // card headers
      fontSize: '15px',
      fontWeight: 700,
      lineHeight: 1.167
    },
    h6: {   // card headers
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.167,
      letterSpacing: '2px',
      ['@media (max-width:576px)']: { // eslint-disable-line no-useless-computed-key
        fontSize: '1.2rem'
      }
    },
    subtitle1: {
      fontSize: '14px',
      fontWeight: 300,
      lineHeight: 1.167,
      ['@media (max-width:576px)']: { // eslint-disable-line no-useless-computed-key
        fontSize: '0.7rem'
      }
    },
    body1: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.7,
      ['@media (max-width:576px)']: { // eslint-disable-line no-useless-computed-key
        fontSize: '0.8rem'
      }
    }
  },
  palette: {
    primary: {
      main: "rgba(0, 0, 0, 0.87)"
    },
    secondary: {
      main: "#EFEFEF"
    },
    error: {
      main: "#dc3545"
    }
  },
  overrides: {
    MuiPaper: {
      elevation1: {
        "box-shadow": '0px 7px 7px #0000000A;',
        "-webkit-box-shadow": '0px 7px 7px #0000000A;',
        "-moz-box-shadow": '0px 7px 7px #0000000A;',
      }
    },
    MuiButton: {
      root: {
        minWidth: "50px"
      },
      outlinedSizeSmall: {
        fontSize: "0.7rem",
        padding: "6px 9px",
        ["@media (max-width:576px)"]: {
          // eslint-disable-line no-useless-computed-key
          padding: "3px 0px"
        }
      },
      sizeLarge: {
        padding: "19px 24px",
        minWidth: "150px"
      },
      textSizeLarge: {
        fontSize: "2.4rem",
        ["@media (max-width:576px)"]: {
          // eslint-disable-line no-useless-computed-key
          fontSize: "2rem"
        }
      }
    },
    MuiDialog: {
      paperWidthSm: {
        maxWidth: "800px"
      }
    },
    MuiToggleButton: {
      root: {
        flex: 1,
        border: "none",
        padding: "0px",
        borderRadius: "4px !important",
        margin: "0px 6px"
      }
    },
    MuiSnackbar: {
      root: {
        maxWidth: "calc(100vw - 24px)"
      },
      anchorOriginBottomLeft: {
        bottom: "12px",
        left: "12px",
        "@media (min-width: 960px)": {
          bottom: "50px",
          left: "80px"
        }
      }
    },
    MuiAccordion: {
      root: {
        margin: "0px",
        "&:before": {
          //underline color when textfield is inactive
          backgroundColor: "none",
          height: "0px"
        },
        "&$expanded": {
          margin: "0px"
        }
      }
    },
    MuiAccordionSummary: {
      root: {
        padding: "0px 24px",
        "@media (max-width:576px)": {
          padding: "0px 6px"
        }
      },
      content: {
        margin: "0px !important"
      }
    },
    MuiAccordionDetails: {
      root: {
        padding: "0"
      }
    },
    MuiTableCell: {
      head: {
        padding: "36px 24px"
      },
      body: {
        padding: "12px 24px",
        borderBottom: "none"
      }
    }
  }
};

export default coreTheme;
