'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { MapPin } from 'lucide-react'

const images = [
    '/images/chacara1.jpg',
    '/images/chacara2.jpg',
    '/images/chacara3.jpg',
    '/images/chacara4.jpg',
    '/images/chacara5.jpg',
    '/images/chacara6.jpg',
]

export default function ChacaraShowcase() {
    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const [isDragging, setIsDragging] = useState(false)
    const speed = 1

    const infiniteImages = [...images, ...images, ...images]

    useEffect(() => {
        let raf: number
        const move = () => {
            if (!isDragging && containerRef.current) {
                const totalWidth = containerRef.current.scrollWidth / 3
                const current = x.get()
                x.set((current - speed) % -totalWidth)
            }
            raf = requestAnimationFrame(move)
        }
        raf = requestAnimationFrame(move)
        return () => cancelAnimationFrame(raf)
    }, [isDragging, x])

    return (
        <section
            id="chacara"
            className="relative w-full min-h-screen flex flex-col items-center justify-between 
      overflow-hidden text-center  py-20"
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-4xl md:text-5xl font-semibold text-[#0e1670] z-10"
                style={{ fontFamily: 'Playfair Display, serif' }}
            >
                Chácara Recanto dos Pássaros
            </motion.h2>

            <div
                ref={containerRef}
                className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing mt-10"
            >
                <motion.div
                    drag="x"
                    dragConstraints={{ left: -9999, right: 9999 }}
                    style={{ x }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    className="flex gap-6 md:gap-10 w-max"
                >
                    {infiniteImages.map((src, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.04 }}
                            className="overflow-hidden rounded-3xl shadow-lg 
                         min-w-[300px] md:min-w-[500px] h-[220px] md:h-[340px] flex-shrink-0"
                        >
                            <motion.img
                                src={src}
                                alt={`Chácara ${i + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-[3s]"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="https://www.google.com/maps/search/?api=1&query=Ch%C3%A1cara+Recanto+dos+P%C3%A1ssaros,+Estrada+Vicinal+da+Amizade+1-347,+Hortol%C3%A2ndia-SP,+13187-041"
                target="_blank"
                rel="noopener noreferrer"
                className="
          flex items-center justify-center gap-2 mt-20 mb-10 px-8 py-3 rounded-full
          text-[#10196e] font-semibold text-lg
          bg-[#f3f5fa]
          shadow-[-6px_-6px_12px_rgba(255,255,255,0.8),_6px_6px_12px_rgba(0,0,0,0.15)]
          transition-all duration-300 ease-out
          hover:shadow-[-2px_-2px_5px_rgba(255,255,255,0.6),_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.9),inset_2px_2px_6px_rgba(0,0,0,0.25)]
          hover:text-[#4b57c0]
          active:scale-95 z-10
        "
            >
                <MapPin className="w-5 h-5 text-[#10196e]/80" />
                Como Chegar
            </motion.a>
        </section>
    )
}
