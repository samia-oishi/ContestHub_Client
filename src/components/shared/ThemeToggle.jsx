import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button className="btn btn-ghost btn-square" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
