'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'
import _ from 'lodash'


export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const gradient = 'linear-gradient(135deg, #155dfc 0%, #3b82f6 50%, #60a5fa 100%)'

  const navItems = [
    { name: 'Início', path: '/home' },
    { name: 'Kanban', path: '/kanban' },
    { name: 'Calendário', path: '/calendario' },
  ]

  return (
    !_.includes(['/login', '/cadastro'], pathname) && (
      <header
        className="sticky top-0 z-50 mx-auto w-full backdrop-blur-xl border-b border-white/20"
        style={{
          background: 'rgba(21,93,252,0.25)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15), inset 0 0 1px rgba(255,255,255,0.2)',
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          {/* LOGO */}
          <div
            onClick={() => router.push('/home')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
              style={{
                background: gradient,
                boxShadow: '0 4px 12px rgba(21,93,252,0.4)',
              }}
            >
              K
            </div>
            <span className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
              Kanbanize
            </span>
          </div>

          {/* MOBILE BUTTON */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-white/90 hover:text-white"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* DESKTOP MENU */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-6">
            {navItems.map((item) => (
              <div
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`cursor-pointer rounded-xl px-5 py-2 text-base font-semibold font-sans transition-all duration-200 ${
                pathname === item.path
                ? 'bg-white/20 text-[#155dfc] shadow-md'
                : 'text-black hover:bg-white/15 hover:text-white'
              }`}
              >
              {item.name}
              </div>
            ))}

            {/* LOGOUT */}
            <div
              onClick={() => router.push('/login')}
              className="ml-4 flex cursor-pointer items-center gap-2 rounded-xl bg-red-500/20 px-5 py-2 text-base font-semibold font-sans text-red-600 hover:bg-red-500/30 hover:text-white transition-all"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Sair
            </div>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <DialogPanel
            className="fixed inset-y-0 right-0 z-50 w-3/4 sm:max-w-sm p-6 shadow-2xl border-l border-white/20 backdrop-blur-2xl rounded-l-2xl"
            style={{
              background: 'rgba(21,93,252,0.3)',
              boxShadow:
                'inset 0 0 1px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <div
                onClick={() => router.push('/home')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: gradient }}
                >
                  K
                </div>
                <span className="text-lg font-bold text-white">Kanbanize</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/80"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    router.push(item.path)
                    setMobileMenuOpen(false)
                  }}
                  className="block rounded-xl px-4 py-2 text-base font-semibold font-sans text-white/90 hover:bg-white/20 hover:text-white transition-all"
                >
                  {item.name}
                </div>
              ))}

              <div
                onClick={() => {
                  router.push('/login')
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold font-sans text-red-600 bg-red-500/20 hover:bg-red-500/30 hover:text-white transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sair
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    )
  )
}
