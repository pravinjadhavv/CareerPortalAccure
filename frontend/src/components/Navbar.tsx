import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'text-sm font-medium px-3 py-1 rounded-md transition-colors',
          isActive ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  const nav = useNavigate()
  const auth = useAuth()

  return (
    <header className="bg-[#0a3c66] text-white shadow">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-white/15">
            <span className="text-xs">CP</span>
          </span>
          CareerPortal
        </Link>

        <nav className="flex items-center gap-1">
          <NavItem to="/" label="Home" />
          {auth.role === 'CANDIDATE' ? (
            <>
              <NavItem to="/jobs" label="Jobs" />
              <NavItem to="/candidate/profile" label="Profile" />
            </>
          ) : null}
          {auth.role === 'COMPANY' ? (
            <>
              <NavItem to="/company/profile" label="Profile" />
            </>
          ) : null}
          {auth.role === 'ADMIN' ? (
            <>
              <NavItem to="/admin/report/companies" label="Companies" />
              <NavItem to="/admin/report/candidates" label="Report" />
            </>
          ) : null}

          {!auth.token ? (
            <NavItem to="/login" label="Login" />
          ) : (
            <button
              className="text-sm font-medium px-3 py-1 rounded-md transition-colors text-white/90 hover:bg-white/10 hover:text-white"
              onClick={() => {
                auth.logout()
                nav('/')
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

