'use client'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import InicioCasamento from '@/components/InicioCasamento'
import ChacaraSection from '@/components/ChacaraSection'

export default function Dashboard() {
    const [guests, setGuests] = useState<any[]>([])
    const [filter, setFilter] = useState<'todos' | 'confirmados' | 'naoVao'>('todos')



    const params = useSearchParams()
    const telefone = params.get('telefone') || ''

    const ADMIN_PHONES =
        process.env.NEXT_PUBLIC_ADMIN_PHONES?.split(',').map((p) => p.trim()) || []
    const cleanPhone = telefone.replace(/\D/g, '')
    const isAdmin = ADMIN_PHONES.includes(cleanPhone)

    useEffect(() => {
        if (telefone) fetchGuests()
    }, [telefone])

    async function fetchGuests() {
        try {
            const [resConvidados, resGrupos] = await Promise.all([
                fetch(`/api/convidados?telefone=${telefone}`),
                fetch('/api/grupos'),
            ])

            const convidados = await resConvidados.json()
            const grupos = await resGrupos.json()

            const convidadosComGrupo = (convidados || []).map((g: any) => {
                const grupo = grupos.find((gr: any) => gr.id === g.grupo_id)
                return { ...g, grupo_nome: grupo ? grupo.nome : 'Sem grupo' }
            })

            setGuests(convidadosComGrupo)
        } catch (err) {
            console.error('Erro ao buscar convidados:', err)
            setGuests([])
        }
    }


    async function setStatus(id: number, newStatus: 'Confirmado' | 'Não vou') {
        const convidado = guests.find((g) => g.id === id)
        const current = convidado?.status

        // regra de toggle → se clicar no que já está ativo, vira Pendente
        const finalStatus =
            current === newStatus ? 'Pendente' : newStatus

        const res = await fetch('/api/convidados', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: finalStatus }),
        })

        if (!res.ok) {
            alert('Falha ao atualizar presença.')
            return
        }

        setGuests((prev) =>
            prev.map((g) =>
                g.id === id ? { ...g, status: finalStatus } : g
            )
        )
    }



    const filteredGuests = useMemo(() => {
        if (filter === 'confirmados')
            return guests.filter((g) => g.status === 'Confirmado')
        if (filter === 'naoVao')
            return guests.filter((g) => g.status === 'Não vou')
        return guests
    }, [guests, filter])



    const groupedGuests = useMemo(() => {
        const map = new Map<string, any[]>()
        filteredGuests.forEach((g) => {
            const grupoNome = g.grupo_nome || 'Sem grupo'
            if (!map.has(grupoNome)) map.set(grupoNome, [])
            map.get(grupoNome)!.push(g)
        })
        return Array.from(map.entries())
    }, [filteredGuests])

    const totalGrupos = groupedGuests.length
    const totalPessoas = filteredGuests.length





    useEffect(() => {
        if (telefone) fetchGuests()

        const atualizarLista = () => fetchGuests()
        window.addEventListener('atualizarConvidados', atualizarLista)

        return () => {
            window.removeEventListener('atualizarConvidados', atualizarLista)
        }
    }, [telefone])





    return (
        <div className="relative min-h-screen text-[#0e1670] scroll-smooth overflow-hidden bg-gradient-to-br from-[#fdfdff] via-[#f6f8ff] to-[#eef1ff]">
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#0f155e] via-[#18226b] to-[#253080] opacity-[0.05] z-0"
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            <Header telefone={telefone ?? ''} />

            <main className="relative z-10 flex flex-col items-center justify-center w-full">
                <section className="w-full min-h-screen flex items-center justify-center overflow-visible">
                    <InicioCasamento />
                </section>



                <ChacaraSection />



                <section
                    id="confirmacao"
                    className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-20 md:py-32"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-10"
                    >
                        <h1
                            className="text-3xl md:text-4xl font-light tracking-wide mb-2 text-[#0e1670]"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Lista de Presença
                        </h1>
                        <p
                            className="text-[#0e1670]/70 text-sm md:text-base"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            Confirme ou visualize seus convidados
                        </p>
                    </motion.div>

                    {isAdmin && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 w-full max-w-3xl"
                        >
                            <div className="flex gap-3 flex-wrap justify-center">
                                <button
                                    onClick={() => setFilter('todos')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === 'todos'
                                        ? 'bg-[#0e1670] text-white'
                                        : 'bg-white border border-[#0e1670]/30 text-[#0e1670]'
                                        }`}
                                >
                                    Todos
                                </button>

                                <button
                                    onClick={() => setFilter('confirmados')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === 'confirmados'
                                        ? 'bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white'
                                        : 'bg-white border border-green-500/40 text-green-700'
                                        }`}
                                >
                                    Confirmados
                                </button>



                                <button
                                    onClick={() => setFilter('naoVao')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === 'naoVao'
                                        ? 'bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white'
                                        : 'bg-white border border-red-500/40 text-red-700'
                                        }`}
                                >
                                    Não vão
                                </button>
                            </div>


                            <div className="text-sm text-[#0e1670]/80 font-medium">
                                <p>
                                    <span className="font-semibold">{totalGrupos}</span> grupos —{' '}
                                    <span className="font-semibold">{totalPessoas}</span> pessoas
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <div className="w-full max-w-3xl max-h-[70vh] overflow-y-auto flex flex-col items-center">
                        <AnimatePresence>
                            {guests.length === 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center text-[#0e1670]/70 mt-8"
                                >
                                    Nenhum convidado encontrado para este número.
                                </motion.p>
                            )}

                            {groupedGuests.map(([grupo, lista]) => (
                                <motion.div
                                    key={grupo}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="w-full bg-white/80 backdrop-blur-md border border-[#b8c2ff]/40 
      shadow-sm rounded-2xl p-6 mb-6"
                                >
                                    {/* 👇 Só exibe o nome do grupo se for admin */}
                                    {isAdmin && (
                                        <h2 className="text-lg font-semibold text-[#0e1670] mb-3">
                                            {grupo}
                                        </h2>
                                    )}

                                    {lista.map((g: any) => (
                                        <motion.div
                                            key={g.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center 
        bg-white/70 border border-[#b8c2ff]/30 rounded-xl p-3 mb-3 hover:shadow-md transition-all"
                                        >

                                            {/* Nome — Status */}
                                            <div className="mb-2 sm:mb-0">
                                                <p className="text-base font-medium text-[#0e1670]">
                                                    {g.nome}
                                                    <span className="text-sm text-[#0e1670]/60">
                                                        — {g.status || 'Pendente'}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Botões */}
                                            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">

                                                {/* Botão Confirmar */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setStatus(g.id, 'Confirmado')}
                                                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-md transition-all
                                                     ${g.status === 'Confirmado'
                                                            ? 'bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white'
                                                            : 'bg-white border border-green-500/40 text-green-700'
                                                        }
        `}
                                                >
                                                    Confirmar
                                                </motion.button>

                                                {/* Botão Não vou */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setStatus(g.id, 'Não vou')}
                                                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-md transition-all
            ${g.status === 'Não vou'
                                                            ? 'bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white'
                                                            : 'bg-white border border-red-500/40 text-red-700'
                                                        }
        `}
                                                >
                                                    Não vou
                                                </motion.button>

                                            </div>


                                        </motion.div>

                                    ))}
                                </motion.div>
                            ))}

                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    )
}
