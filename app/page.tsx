'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11) 
  const part1 = digits.slice(0, 2)
  const part2 = digits.slice(2, 7)
  const part3 = digits.slice(7, 11)

  if (digits.length > 7) return `(${part1}) ${part2}-${part3}`
  if (digits.length > 2) return `(${part1}) ${part2}`
  if (digits.length > 0) return `(${part1}`
  return ''
}

export default function LoginPage() {
  const [telefone, setTelefone] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value))
  }

  const handleLogin = () => {
    const cleaned = telefone.replace(/\D/g, '')
    if (cleaned.length >= 10) router.push(`/dashboard?telefone=${cleaned}`)
  }

  return (
    <main className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#f8f8f8] text-[#1c2b3a]">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white via-[#e8edf2] to-[#f8f8f8] blur-3xl"
        animate={{
          opacity: [0.9, 1, 0.9],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 8,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#aeb7c0]/20 blur-3xl top-1/3 left-1/3"
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 10,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-[#1c2b3a]/10 blur-3xl bottom-10 right-10"
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{
          duration: 12,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 backdrop-blur-2xl bg-white/60 border border-white/40 shadow-[0_8px_50px_rgba(0,0,0,0.1)] rounded-3xl p-10 w-[90%] max-w-md flex flex-col items-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-light tracking-[0.15em] text-[#1c2b3a] mb-6"
        >
          K & Z
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center text-[#3a4b5c]/70 mb-8 text-sm leading-relaxed"
        >
          Confirme sua presença informando o número de telefone
        </motion.p>

        <motion.input
          type="tel"
          inputMode="numeric"
          placeholder="(99) 99999-9999"
          value={telefone}
          onChange={handleChange}
          whileFocus={{ scale: 1.02, borderColor: '#1c2b3a' }}
          className="w-full border border-[#3a4b5c]/30 focus:border-[#1c2b3a] outline-none rounded-xl px-4 py-3 mb-6 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-inner text-center text-lg font-light tracking-wide"
          maxLength={15}
        />

        <motion.button
          whileHover={{ scale: 1.04, backgroundPosition: 'right center' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#3a4b5c] to-[#1c2b3a] bg-[length:200%_auto] hover:from-[#1c2b3a] hover:to-[#3a4b5c] shadow-lg transition-all"
        >
          Entrar
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-xs text-center mt-6 text-[#3a4b5c]/70 italic"
        >
          Seu número será usado apenas para identificar seu grupo 💍
        </motion.div>
      </motion.div>
    </main>
  )
}
