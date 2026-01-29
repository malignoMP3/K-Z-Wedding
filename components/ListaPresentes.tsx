'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { Gift } from 'lucide-react'


interface ListaPresentesProps {
    isOpen: boolean
    onClose: () => void
}

export default function ListaPresentes({ isOpen, onClose }: ListaPresentesProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* MODAL */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="
                            fixed z-50
                            top-1/2 left-1/2
                            -translate-x-1/2 -translate-y-1/2
                            w-[92%] max-w-2xl
                            max-h-[85vh] sm:max-h-[90vh]
                            bg-white rounded-2xl shadow-2xl
                            p-4 sm:p-6 md:p-7
                            overflow-hidden
                            "

                    >
                        {/* BOTÃO FECHAR */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/5 transition"
                        >
                            <X className="w-5 h-5 text-[#1c2b3a]" />
                        </button>

                        {/* LOGO */}
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/images/logo_casamento_2.jpg"
                                alt="Logo do Casamento"
                                width={26}
                                height={26}
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* TÍTULO */}
                        <h2 className="flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#1c2b3a] mb-3">
                            <Gift className="w-5 h-5 md:w-6 md:h-6 text-[#4b57c0]" />
                            Lista de Presentes
                        </h2>



                        {/* LISTA */}
                        <div className="max-h-[32vh] sm:max-h-[38vh] overflow-y-auto pr-1">

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base text-[#1c2b3a]/80">
                                {[
                                    'Aspirador de pó',
                                    'Chaleira elétrica',
                                    'Cafeteira',
                                    'Ferro de passar',
                                    'Conjunto de jantar',
                                    'Jogo de pratos',
                                    'Conjunto de panelas antiaderentes',
                                    'Panela de pressão',
                                    'Criado-mudo',
                                    'Mesa de escritório (escrivaninha)',
                                    'Jogo de cama',
                                    'Colcha',
                                    'Toalhas de mesa',
                                    'Roupões de banho',
                                    'Cômoda',
                                    'Guarda-roupas',
                                    'Armário de cozinha',
                                    'Sofá',
                                    'Manta para sofá',
                                    'Tapete de sala',
                                    'Conjunto de potes herméticos de vidro',
                                    'Espelho de parede',
                                    'Relógio de parede',
                                    'Tapetes de banheiro',
                                    'Tapetes de cozinha',
                                    'Prateleiras de madeira',
                                    'Ar-condicionado',
                                    'Cesto de roupas (100L/120L)',
                                    'Abajur para quarto',
                                    'Abajur de chão',
                                    'Jogo de ferramentas (maleta)',
                                    'Lava-louças',
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 bg-[#f3f5fa] rounded-lg px-3 py-1.5"
                                    >

                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* IDEIAS EXTRAS */}
                        <div className="mt-4 pt-3 border-t border-[#1c2b3a]/10">
                            <p className="font-medium text-[#1c2b3a] mb-2 text-sm sm:text-base">
                                💡 Outras ideias
                            </p>

                            <ul className="space-y-1.5 text-sm sm:text-base text-[#1c2b3a]/70">
                                <li>🚗 Contribuições para nosso futuro carro</li>
                                <li>🏠 Contribuições para nossa futura casa</li>
                                <li>💍 1 mês de aluguel do casal</li>
                            </ul>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
