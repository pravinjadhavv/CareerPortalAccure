import type { ReactNode } from 'react'

export function PageShell({
  children,
  footer = true,
}: {
  children: ReactNode
  footer?: boolean
}) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <main className="py-10">{children}</main>
      {footer ? (
        <footer className="mt-14 border-t border-slate-200 bg-[#0a3c66] text-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between text-xs text-white/90">
            <span>© CareerPortal. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a className="hover:underline" href="#">
                About
              </a>
              <a className="hover:underline" href="#">
                Contact
              </a>
              <a className="hover:underline" href="#">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

