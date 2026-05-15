import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const lightTheme = 'light'
const darkTheme = 'dark'

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === lightTheme || savedTheme === darkTheme) return savedTheme
  if (savedTheme === 'contesthub') return lightTheme
  if (savedTheme === 'contesthubdark') return darkTheme

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === darkTheme,
      toggleTheme: () => setTheme((current) => (current === lightTheme ? darkTheme : lightTheme)),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
