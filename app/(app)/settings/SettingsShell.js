import Link from 'next/link'
import s from './account/settings.module.css'

export function SettingsIcon({ name = 'arrow', ...props }) {
  const paths = {
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
    lock: 'M6 10h12v11H6zM8 10V7a4 4 0 0 1 8 0v3m-4 5v2',
    card: 'M3 5h18v14H3zM3 10h18M7 15h3',
    spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
    check: 'm5 12 4 4L19 6',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    eyeOff: 'm3 3 18 18M10 5c7-1 12 7 12 7a19 19 0 0 1-4 5M6 6a20 20 0 0 0-4 6s3.5 7 10 7c2 0 3.5-.5 5-1.5M10 10a3 3 0 0 0 4 4',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v5l3 2',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    help: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01',
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}

export function SettingsPassword({ id, label, value, onChange, visible, onToggle, disabled, autoComplete, placeholder, invalid, describedBy }) {
  return <div className={s.field}><label htmlFor={id}>{label}</label><div className={s.inputWrap}><SettingsIcon name="lock" className={s.inputIcon} /><input id={id} type={visible ? 'text' : 'password'} value={value} onChange={onChange} disabled={disabled} autoComplete={autoComplete} placeholder={placeholder} required maxLength={128} className={s.input} aria-invalid={Boolean(invalid)} aria-describedby={describedBy} /><button type="button" className={s.eyeBtn} onClick={onToggle} disabled={disabled} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible}><SettingsIcon name={visible ? 'eyeOff' : 'eye'} /></button></div></div>
}

export function SettingsNotice({ children, tone = 'info', title }) {
  return <div className={`${s.notice} ${tone === 'success' ? s.noticeSuccess : tone === 'warning' ? s.noticeWarning : ''}`}><SettingsIcon name={tone === 'success' ? 'check' : 'clock'} /><div>{title && <strong>{title}</strong>}<p>{children}</p></div></div>
}

export default function SettingsShell({ active, children }) {
  const account = active === 'account'
  return <main className={s.page}><div className={s.ambient} aria-hidden="true" /><div className={s.workspace}><div className={s.breadcrumb}><Link href="/dashboard">Dashboard</Link><span>/</span><span>Settings</span><span>/</span><strong>{account ? 'Account' : 'Billing'}</strong></div><div className={s.layout}><aside className={s.sidebar}><span className={s.eyebrow}>YOUR PERSONAL SPACE</span><h2>Make it<br /><em>yours.</em></h2><nav aria-label="Settings"><Link href="/settings/account" aria-current={account ? 'page' : undefined}><SettingsIcon name="shield" /><span>Account<small>Password & security</small></span><span className={s.navArrow}>↗</span></Link><Link href="/settings/billing" aria-current={!account ? 'page' : undefined}><SettingsIcon name="card" /><span>Billing<small>Your membership</small></span><span className={s.navArrow}>↗</span></Link></nav><Link href="/dashboard" className={s.dashboardLink}><SettingsIcon name="grid" />Back to your dashboard</Link><div className={s.sidebarHelp}><SettingsIcon name="help" /><strong>A little help?</strong><p>We’re here if you need a hand with your account.</p><Link href="/contact">Talk to us <span aria-hidden="true">↗</span></Link></div></aside><div className={s.content}><header className={s.pageHeader}><div><span className={s.eyebrow}>{account ? 'KEEP YOUR RESET YOURS' : 'YOUR NEXT CHAPTER, COVERED'}</span><h1>{account ? 'Account & security.' : 'Your membership.'}</h1><p>{account ? 'A little peace of mind for everything you’re building.' : 'Your plan, your payments, and what comes next. All in one place.'}</p></div><span className={s.headerIcon}><SettingsIcon name={account ? 'shield' : 'card'} /></span></header>{children}<footer className={s.workspaceFooter}><span>LESS AUTOPILOT. MORE INTENTION.</span><Link href="/privacy">Privacy policy ↗</Link></footer></div></div></div></main>
}
