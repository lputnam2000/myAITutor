import {createGlobalStyle} from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${({theme}) => theme.colors.primary};
    padding: 0;
    margin: 0;
    font-family: var(--font-open) -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: transparent;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    scrollbar-color: #666 #2C2C2C;
    scrollbar-width: thin;
  }

  *::-webkit-scrollbar {
    width: 10px;
  }

  *::-webkit-scrollbar-track {
    background-color: #242933;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 10px;
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`

export default GlobalStyle