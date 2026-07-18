import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { ChatAgent } from '../../features/chat/ChatAgent'

export function AppShell() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        display: 'flex',
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, padding: '26px 34px 90px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <TopBar />
          <Outlet />
        </div>
      </main>
      <ChatAgent />
    </div>
  )
}
