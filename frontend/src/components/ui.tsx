import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white/80 shadow-sm ring-1 ring-slate-200 backdrop-blur">
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 pt-6 pb-3 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  )
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="px-6 pb-6">{children}</div>
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="text-xs font-medium text-slate-600">{children}</label>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function Button({
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'success' | 'danger' }) {
  const styles =
    variant === 'primary'
      ? 'bg-sky-600 hover:bg-sky-700 text-white'
      : variant === 'success'
        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
        : variant === 'danger'
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'

  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        styles,
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function SectionTitle({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-700 font-semibold">
      {icon ? <span className="text-sky-600">{icon}</span> : null}
      <span>{title}</span>
    </div>
  )
}

