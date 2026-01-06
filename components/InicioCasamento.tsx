'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'
import ListaPresentes from '@/components/ListaPresentes'


export default function InicioCasamento() {
    const [listaPresentesOpen, setListaPresentesOpen] = useState(false)

    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    })
    const [isMarried, setIsMarried] = useState(false)

    useEffect(() => {
        const targetDate = new Date('2026-02-15T14:30:00-03:00').getTime()
        const updateCountdown = () => {
            const now = new Date().getTime()
            const diff = targetDate - now
            if (diff <= 0) {
                setIsMarried(true)
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
                return
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)
            setTimeLeft({
                days: days.toString().padStart(2, '0'),
                hours: hours.toString().padStart(2, '0'),
                minutes: minutes.toString().padStart(2, '0'),
                seconds: seconds.toString().padStart(2, '0'),
            })
        }
        const timer = setInterval(updateCountdown, 1000)
        return () => clearInterval(timer)
    }, [])

    const scrollToConfirmacao = () => {
        const section = document.querySelector('#confirmacao')
        if (section) section.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section
            id="inicio"
            className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-36 md:pt-44 relative overflow-hidden"
        >

            {/* BACKGROUND */}
            <div
                className="
    absolute inset-0
    bg-[url('/images/background_2.jpg')]
    bg-cover bg-top
    bg-no-repeat
    opacity-50
  "
            />


            {/* OVERLAY CLARO (bem mais leve) */}
            <div className="absolute inset-0 bg-[#f8f7f4]/50" />



            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-4">

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 bg-gradient-to-r from-[#1b1f8a] via-[#4b57c0] to-[#7c89ff] bg-clip-text text-transparent leading-tight drop-shadow-sm"
                >
                    {isMarried ? 'Kaian Cipriano & Zainy Sandres' : 'Zainy & Kaian'}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-base md:text-lg lg:text-xl text-[#141a73]/80 mb-10 leading-relaxed px-4 max-w-md"
                >
                    {isMarried ? 'Juntos para sempre 💫' : 'Nosso grande dia está chegando! 💖'}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex gap-4 md:gap-8 mb-12 flex-wrap justify-center"
                >
                    {[
                        { label: 'Dias', value: timeLeft.days },
                        { label: 'Horas', value: timeLeft.hours },
                        { label: 'Minutos', value: timeLeft.minutes },
                        { label: 'Segundos', value: timeLeft.seconds },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-lg 
                         border border-[#cfd5ff]/50 shadow-sm rounded-2xl w-24 h-24 md:w-28 md:h-28
                         transition-all duration-300"
                        >
                            <span className="text-2xl md:text-3xl font-semibold text-[#141a73]">
                                {item.value}
                            </span>
                            <span className="text-xs md:text-sm text-[#141a73]/70 uppercase tracking-wider">
                                {item.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { staggerChildren: 0.2, delayChildren: 0.2 },
                        },
                    }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 w-full"
                >
                    {/* Confirmar Presença */}
                    <motion.button
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={scrollToConfirmacao}
                        className="
      flex items-center justify-center gap-2 px-8 md:px-10 py-3 md:py-4 rounded-full
      text-[#10196e] font-semibold text-base md:text-lg
      bg-[#f3f5fa] 
      shadow-[-6px_-6px_12px_rgba(255,255,255,0.8),_6px_6px_12px_rgba(0,0,0,0.15)]
      transition-all duration-300 ease-out
      hover:shadow-[-2px_-2px_5px_rgba(255,255,255,0.6),_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.9),inset_2px_2px_6px_rgba(0,0,0,0.25)]
      hover:text-[#4b57c0]
      active:scale-95
    "
                    >
                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                        Confirmar Presença
                    </motion.button>

                    {/* Ver Local */}
                    <motion.button
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                            const section = document.querySelector('#chacara')
                            if (section) section.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="
      flex items-center justify-center gap-2 px-8 md:px-10 py-3 md:py-4 rounded-full
      text-[#10196e] font-semibold text-base md:text-lg
      bg-[#f3f5fa]
      shadow-[-6px_-6px_12px_rgba(255,255,255,0.8),_6px_6px_12px_rgba(0,0,0,0.15)]
      transition-all duration-300 ease-out
      hover:shadow-[-2px_-2px_5px_rgba(255,255,255,0.6),_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.9),inset_2px_2px_6px_rgba(0,0,0,0.25)]
      hover:text-[#4b57c0]
      active:scale-95
    "
                    >
                        <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                        Ver Local
                    </motion.button>



                    {/* Lista de Presentes */}
                    <motion.button
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setListaPresentesOpen(true)}
                        className="
    flex items-center justify-center gap-2
    px-8 md:px-10 py-3 md:py-4 rounded-full
    text-[#10196e] font-semibold text-base md:text-lg
    bg-[#f3f5fa]
    shadow-[-6px_-6px_12px_rgba(255,255,255,0.8),_6px_6px_12px_rgba(0,0,0,0.15)]
    transition-all duration-300 ease-out
    hover:shadow-[-2px_-2px_5px_rgba(255,255,255,0.6),_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.9),inset_2px_2px_6px_rgba(0,0,0,0.25)]
    hover:text-[#4b57c0]
    active:scale-95
  "
                    >
                        Lista de Presentes
                    </motion.button>




                </motion.div>





                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="flex flex-row items-center justify-center gap-8 mb-4"
                >
                    {[
                        { href: 'https://www.instagram.com/kaian.sandres', role: 'Sandres' },
                        { href: 'https://www.instagram.com/zay_cipriano', role: 'Cipriano' },
                    ].map((profile, i) => (
                        <motion.a
                            key={i}
                            href={profile.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center gap-2 text-[#10196e]/80 hover:text-[#0c0f84] 
                         transition-all duration-300 text-sm md:text-base font-medium"
                        >
                            <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
                            {profile.role}
                        </motion.a>
                    ))}
                </motion.div>
            </div>

            <ListaPresentes
                isOpen={listaPresentesOpen}
                onClose={() => setListaPresentesOpen(false)}
            />



        </section>





    )


}
