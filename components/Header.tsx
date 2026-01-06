'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Users, LogOut } from 'lucide-react'
import ModalGrupos from '@/components/ModalGrupos'
import Image from 'next/image'



interface HeaderProps {
  telefone?: string
}

export default function Header({ telefone }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  const ADMIN_PHONES =
    process.env.NEXT_PUBLIC_ADMIN_PHONES?.split(',').map(p => p.trim()) || []

  const cleanPhone = telefone?.replace(/\D/g, '') || ''
  const isAdmin = ADMIN_PHONES.includes(cleanPhone)

  const scrollToStart = () => {
    const section = document.querySelector('#inicio')
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToConfirmacao = () => {
    const section = document.querySelector('#confirmacao')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/dashboard#confirmacao')
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/30 shadow-[0_2px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 flex justify-between items-center py-3 min-h-[80px]">

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="cursor-pointer flex items-center"
          onClick={scrollToStart}
        >
          <Image
            src="/images/logo_casamento_3.png"
            alt="Logo K & Z"
            width={42}
            height={42}
            className="object-contain"
            priority
          />


        </motion.div>


        <nav className="hidden md:flex gap-10 text-[#1c2b3a]/80 font-medium text-sm items-center">
          <motion.span
            onClick={scrollToStart}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer hover:text-[#1c2b3a] transition-all"
          >
            Início
          </motion.span>

          <motion.span
            onClick={scrollToConfirmacao}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer hover:text-[#1c2b3a] transition-all"
          >
            Confirmação
          </motion.span>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#2a3a4c' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c2b3a] text-white text-sm shadow-md hover:shadow-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </motion.button>

          {isAdmin && (
            <>
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: '#25394d' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c2b3a] text-white text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Grupos</span>
              </motion.button>

              <ModalGrupos isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            </>
          )}
        </nav>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="md:hidden flex flex-col justify-center items-center space-y-[6px]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px] bg-[#1c2b3a] rounded-full"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-[2px] bg-[#1c2b3a] rounded-full"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px] bg-[#1c2b3a] rounded-full"
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-white/30 flex flex-col items-center py-6 space-y-6 text-[#1c2b3a]/80 font-medium"
          >
            <span
              onClick={() => {
                setMenuOpen(false)
                scrollToStart()
              }}
              className="cursor-pointer"
            >
              Início
            </span>

            <span
              onClick={() => {
                setMenuOpen(false)
                scrollToConfirmacao()
              }}
              className="cursor-pointer"
            >
              Confirmação
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMenuOpen(false)
                handleLogout()
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c2b3a] text-white text-sm shadow-md cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </motion.button>

            {isAdmin && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMenuOpen(false)
                    setModalOpen(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c2b3a] text-white text-sm shadow-md cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Grupos</span>
                </motion.button>

                <ModalGrupos
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                />
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

    </motion.header>



  )
}
