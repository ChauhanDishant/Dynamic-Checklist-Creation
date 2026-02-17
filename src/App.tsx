import React, { useEffect } from 'react'
import { Moon, Sun, Save, CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { TwoColumnLayout } from './components/templates'
import { ChecklistFormPanel, ChecklistPreviewPanel } from './components/organisms'
import { Button } from './components/atoms'
import { useTheme, useChecklist, useLocalStorageQuota } from './hooks'
import './styles/globals.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { checklist } = useChecklist()
  const { usage, quota, isNearLimit } = useLocalStorageQuota()
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle')

  // Auto-save indicator
  useEffect(() => {
    setSaveStatus('saving')
    const timer = setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 500)

    return () => clearTimeout(timer)
  }, [checklist])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        // Undo is handled in ChecklistFormPanel
      }
      // Ctrl+Y for redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault()
        // Redo is handled in ChecklistFormPanel
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">Dynamic Checklist Creator</h1>
          <span className="text-xs text-muted-foreground">v1.0.0</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Storage Quota */}
          {isNearLimit && (
            <div className="text-xs text-destructive">
              Storage: {usage.toFixed(2)}MB / {quota}MB
            </div>
          )}

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-14 h-screen">
        <TwoColumnLayout
          left={<ChecklistFormPanel />}
          right={<ChecklistPreviewPanel checklist={checklist} />}
        />
      </div>

      {/* Auto-save Indicator */}
      <AnimatePresence>
        {saveStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="save-indicator"
          >
            {saveStatus === 'saving' ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                All changes saved
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
