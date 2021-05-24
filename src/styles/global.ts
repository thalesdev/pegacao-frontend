import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100vw;
    background:white;
    z-index:10;
  }

  body {
    /* background: ${props => props.theme.colors.background}; */
    color: ${props => props.theme.colors.text};
    font: 400 16px Roboto, sans-serif;
    background:
    linear-gradient(to bottom, #163C52 0%,#4F4F47 30%,#C5752D 60%,#B7490F 80%, #2F1107 100%) !important;
  }

  body,
  html{
    width: 100vw;
    height:100vh;
    overflow: hidden;
  }
`
