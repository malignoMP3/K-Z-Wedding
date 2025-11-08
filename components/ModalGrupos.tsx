'use client'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, PlusCircle, List, Edit3, Trash2, Save, XCircle } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function ModalGrupos({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [mounted, setMounted] = useState(false)
    const [step, setStep] = useState<'criar' | 'listar' | 'convidados'>('criar')
    const [nomeGrupo, setNomeGrupo] = useState('')
    const [telefoneGrupo, setTelefoneGrupo] = useState('')
    const [erroTelefone, setErroTelefone] = useState(false)
    const [grupos, setGrupos] = useState<any[]>([])
    const [filtro, setFiltro] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [grupoSelecionado, setGrupoSelecionado] = useState<number | null>(null)
    const [convidados, setConvidados] = useState<
        { id?: number; nome: string; telefone?: string; grupo_id?: number; status?: string }[]
    >([])
    const [novoConvidado, setNovoConvidado] = useState('')
    const [loading, setLoading] = useState(false)

    const [editandoGrupoId, setEditandoGrupoId] = useState<number | null>(null)
    const [novoNomeGrupo, setNovoNomeGrupo] = useState('')
    const [editandoConvidadoId, setEditandoConvidadoId] = useState<number | null>(null)
    const [novoNomeConvidado, setNovoNomeConvidado] = useState('')

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (isOpen) {
            fetchGrupos()
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    async function fetchGrupos() {
        const res = await fetch('/api/grupos')
        const data = await res.json()
        console.log('grupos: ', data)
        setGrupos(data || [])
    }

    async function fetchConvidados(grupoId: number) {
        const res = await fetch(`/api/convidados?grupo_id=${grupoId}`)
        if (!res.ok) return
        const data = await res.json()
        setConvidados(data || [])
    }

    async function toggleStatus(id: number, newStatus: string) {
        try {
            const res = await fetch('/api/convidados', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })
            if (res.ok) {
                const updated = convidados.map((c) =>
                    c.id === id ? { ...c, status: newStatus } : c
                )
                setConvidados(updated)
            }
        } catch (err) {
            console.error('Erro ao atualizar status:', err)
        }
    }

    const handleTelefoneChange = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11)
        const part1 = digits.slice(0, 2)
        const part2 = digits.slice(2, 7)
        const part3 = digits.slice(7, 11)
        let formatted = ''
        if (digits.length > 7) formatted = `(${part1}) ${part2}-${part3}`
        else if (digits.length > 2) formatted = `(${part1}) ${part2}`
        else if (digits.length > 0) formatted = `(${part1}`
        setTelefoneGrupo(formatted)
    }

    async function criarGrupo() {
        if (!nomeGrupo || !telefoneGrupo) {
            alert('Preencha nome e telefone')
            return
        }

        const telefoneLimpo = telefoneGrupo.replace(/\D/g, '')
        const telefoneJaExiste = grupos.some(
            (g) => g.telefone.replace(/\D/g, '') === telefoneLimpo
        )

        if (telefoneJaExiste) {
            setErroTelefone(true)
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/grupos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeGrupo, telefone: telefoneLimpo })
            })
            if (!res.ok) throw new Error('Erro ao criar grupo')

            await fetchGrupos()
            setNomeGrupo('')
            setTelefoneGrupo('')
            alert('Grupo criado com sucesso ✅')
        } catch (err) {
            console.error('Erro ao criar grupo:', err)
            alert('Erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    async function editarGrupo(id: number) {
        if (!novoNomeGrupo.trim()) return alert('Informe o novo nome')
        const res = await fetch('/api/grupos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nome: novoNomeGrupo })
        })
        if (res.ok) {
            setEditandoGrupoId(null)
            setNovoNomeGrupo('')
            await fetchGrupos()
        }
    }

    async function deletarGrupo(id: number) {
        if (!confirm('Deseja realmente excluir este grupo e todos os convidados?')) return
        await fetch(`/api/grupos?id=${id}`, { method: 'DELETE' })
        if (grupoSelecionado === id) {
            setStep('listar')
            setGrupoSelecionado(null)
        }
        await fetchGrupos()
    }

    async function criarConvidado() {
        if (!novoConvidado || !grupoSelecionado)
            return alert('Preencha o nome do convidado e selecione um grupo.')

        const grupo = grupos.find((g) => g.id === grupoSelecionado)
        setLoading(true)
        const res = await fetch('/api/convidados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: novoConvidado,
                telefone: grupo.telefone,
                grupo_id: grupo.id,
                status: 'Não confirmado'
            })
        })

        if (res.ok) {
            await fetchConvidados(grupoSelecionado)
            setNovoConvidado('')
        }

        setLoading(false)
    }

    async function editarConvidado(id: number) {
        if (!novoNomeConvidado.trim()) return alert('Informe o novo nome')
        const res = await fetch('/api/convidados', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nome: novoNomeConvidado })
        })
        if (res.ok && grupoSelecionado) {
            setEditandoConvidadoId(null)
            setNovoNomeConvidado('')
            await fetchConvidados(grupoSelecionado)
        }
    }

    async function deletarConvidado(id: number) {
        if (!confirm('Deseja excluir este convidado?')) return
        await fetch(`/api/convidados?id=${id}`, { method: 'DELETE' })
        if (grupoSelecionado) await fetchConvidados(grupoSelecionado)
    }

    const gruposFiltrados = useMemo(() => {
        const termo = filtro.trim().toLowerCase()
        if (!termo) return grupos

        const normalizar = (texto: string) =>
            (texto || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()

        const termoNormalizado = normalizar(termo)
        const termoNumerico = filtro.replace(/\D/g, '')

        const resultado = grupos.filter((g) => {
            const nomeGrupo = normalizar(g?.nome || '')
            const telefoneGrupo = (g?.telefone || '').replace(/\D/g, '')

            const telefoneMatch =
                termoNumerico.length > 0 && telefoneGrupo.includes(termoNumerico)

            const nomeMatch =
                termoNormalizado.length > 0 && nomeGrupo.includes(termoNormalizado)

            return nomeMatch || telefoneMatch
        })
        return resultado
    }, [filtro, grupos])

    if (!mounted || !isOpen) return null
    return createPortal(
        <AnimatePresence>
            <motion.div
                key="overlay"
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, y: -40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 
           shadow-[0_8px_50px_rgba(0,0,0,0.15)] rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
                >
                    <motion.button
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#1c2b3a]/70 hover:text-[#1c2b3a] cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>

                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl font-light text-[#1c2b3a] mb-6 flex items-center gap-2 justify-center"
                    >
                        {step === 'criar' && (
                            <>
                                <Users className="w-5 h-5 text-[#1c2b3a]" /> Criar Novo Grupo
                            </>
                        )}
                        {step === 'listar' && (
                            <>
                                <List className="w-5 h-5 text-[#1c2b3a]" /> Meus Grupos
                            </>
                        )}
                        {step === 'convidados' && (
                            <>
                                <PlusCircle className="w-5 h-5 text-[#1c2b3a]" /> Adicionar Convidados
                            </>
                        )}
                    </motion.h2>

                    {step === 'criar' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[#1c2b3a] mb-2">
                                    Nome do grupo
                                </label>
                                <input
                                    type="text"
                                    value={nomeGrupo}
                                    onChange={(e) => setNomeGrupo(e.target.value)}
                                    className="w-full border border-[#1c2b3a]/20 rounded-2xl px-5 py-4 text-base 
                    focus:border-[#1c2b3a] outline-none bg-white/80 text-[#1c2b3a]
                    shadow-inner focus:shadow-[0_0_8px_rgba(28,43,58,0.25)]"
                                />
                            </div>

                            <motion.div
                                animate={erroTelefone ? { x: [-5, 5, -5, 5, 0] } : {}}
                                transition={{ duration: 0.4 }}
                            >
                                <label className="block text-sm font-medium text-[#1c2b3a] mb-2">
                                    Telefone (99) 99999-9999
                                </label>
                                <input
                                    type="tel"
                                    value={telefoneGrupo}
                                    onChange={(e) => handleTelefoneChange(e.target.value)}
                                    className={`w-full border rounded-2xl px-5 py-4 text-base bg-white/80 text-[#1c2b3a] shadow-inner outline-none transition-all
                    ${erroTelefone
                                            ? 'border-red-500 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                            : 'border-[#1c2b3a]/20 focus:border-[#1c2b3a] focus:shadow-[0_0_8px_rgba(28,43,58,0.25)]'
                                        }`}
                                />
                                {erroTelefone && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-red-600 text-sm mt-2 font-medium"
                                    >
                                        Este telefone já está cadastrado em outro grupo.
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={criarGrupo}
                                disabled={loading}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2a3a4c] to-[#1c2b3a]
                  text-white text-sm font-medium shadow-md hover:brightness-110
                  transition-all cursor-pointer"
                            >
                                {loading ? 'Criando...' : 'Criar Grupo'}
                            </motion.button>

                            <div className="flex justify-center pt-6">
                                <motion.button
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setStep('listar')}
                                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-medium 
                    bg-gradient-to-r from-[#1c2b3a] to-[#2a3a4c] text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] 
                    hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)] transition-all duration-300"
                                >
                                    <Users className="w-4 h-4" />
                                    Ver grupos existentes
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {step === 'listar' && (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-4 w-full">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setStep('criar')}
                                    className="text-sm px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1c2b3a] to-[#2a3a4c]
                    text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]
                    hover:brightness-110 transition-all duration-300"
                                >
                                    + Novo grupo
                                </motion.button>

                                <input
                                    type="text"
                                    placeholder="🔍 Pesquisar por nome ou telefone..."
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                    className="w-full border border-[#1c2b3a]/25 rounded-2xl px-5 py-3 text-sm bg-gradient-to-r 
                    from-white/90 to-gray-50 text-[#1c2b3a] shadow-inner focus:border-[#1c2b3a] outline-none
                    focus:shadow-[0_0_10px_rgba(28,43,58,0.25)] placeholder-[#1c2b3a]/50 transition-all duration-200"
                                />
                            </div>

                            <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-[#1c2b3a]/30">
                                {gruposFiltrados.length === 0 ? (
                                    <p className="text-sm text-[#1c2b3a]/70 italic text-center py-12">
                                        Nenhum grupo encontrado.
                                    </p>
                                ) : (
                                    gruposFiltrados.map((g) => (
                                        <motion.div
                                            key={g.id}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={() => {
                                                if (editandoGrupoId !== g.id) {
                                                    setGrupoSelecionado(g.id)
                                                    fetchConvidados(g.id)
                                                    setStep('convidados')
                                                }
                                            }}
                                            className="p-5 rounded-2xl border border-white/30 bg-white/25 backdrop-blur-lg
          text-[#1c2b3a] hover:bg-white/35 transition-all duration-300 
          shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex justify-between items-center cursor-pointer"
                                        >
                                            <div className="flex-1">
                                                {editandoGrupoId === g.id ? (
                                                    <input
                                                        type="text"
                                                        value={novoNomeGrupo}
                                                        onChange={(e) => setNovoNomeGrupo(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-full text-sm bg-white/60 border border-[#1c2b3a]/30 
                rounded-lg px-3 py-2 text-[#1c2b3a] outline-none backdrop-blur-md
                focus:border-[#1c2b3a] focus:shadow-[0_0_6px_rgba(28,43,58,0.25)]"
                                                    />
                                                ) : (
                                                    <>
                                                        <p className="font-semibold text-base">{g.nome}</p>
                                                        <p className="text-sm opacity-70">{g.telefone}</p>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 ml-3">
                                                {editandoGrupoId === g.id ? (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                editarGrupo(g.id)
                                                            }}
                                                            className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 shadow-sm transition"
                                                        >
                                                            <Save className="w-4 h-4 text-green-600" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setEditandoGrupoId(null)
                                                                setNovoNomeGrupo('')
                                                            }}
                                                            className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 shadow-sm transition"
                                                        >
                                                            <XCircle className="w-4 h-4 text-red-600" />
                                                        </motion.button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setEditandoGrupoId(g.id)
                                                                setNovoNomeGrupo(g.nome)
                                                            }}
                                                            className="p-1.5 rounded-full bg-yellow-100 hover:bg-yellow-200 shadow-sm transition"
                                                        >
                                                            <Edit3 className="w-4 h-4 text-yellow-600" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                deletarGrupo(g.id)
                                                            }}
                                                            className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 shadow-sm transition"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </motion.button>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>



                            <div className="flex justify-center pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setStep('criar')}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium 
                    border border-[#1c2b3a]/30 text-[#1c2b3a] hover:bg-[#e5e7eb] transition-all"
                                >
                                    ← Voltar
                                </motion.button>
                            </div>
                        </div>
                    )}
                    {step === 'convidados' && (
                        <div className="space-y-6">
                            <label className="text-sm text-[#1c2b3a]/80 font-medium mb-2 block">
                                Grupo selecionado:
                            </label>

                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full flex justify-between items-center bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6]
                     border border-[#1c2b3a]/25 rounded-2xl px-5 py-3.5 text-base text-[#1c2b3a]
                     focus:outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)]
                     hover:shadow-[0_0_8px_rgba(28,43,58,0.15)] cursor-pointer font-medium
                     transition-all duration-200"
                                >
                                    {grupoSelecionado
                                        ? grupos.find((g) => g.id === grupoSelecionado)?.nome +
                                        ' — ' +
                                        grupos.find((g) => g.id === grupoSelecionado)?.telefone
                                        : 'Selecione o grupo...'}
                                    <motion.div
                                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="text-[#1c2b3a]/70"
                                    >
                                        ▼
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-xl
                         border border-[#1c2b3a]/20 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)]
                         overflow-hidden max-h-60 overflow-y-auto"
                                        >
                                            {grupos.length === 0 && (
                                                <li className="px-5 py-3 text-sm text-[#1c2b3a]/70 italic">
                                                    Nenhum grupo encontrado
                                                </li>
                                            )}
                                            {grupos.map((g) => (
                                                <motion.li
                                                    key={g.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    onClick={() => {
                                                        setGrupoSelecionado(g.id)
                                                        setDropdownOpen(false)
                                                        fetchConvidados(g.id)
                                                    }}
                                                    className={`px-5 py-3 text-sm cursor-pointer transition-all ${grupoSelecionado === g.id
                                                            ? 'bg-[#1c2b3a]/90 text-white'
                                                            : 'hover:bg-[#1c2b3a]/10 text-[#1c2b3a]'
                                                        }`}
                                                >
                                                    {g.nome} — {g.telefone}
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            {convidados.length > 0 && (
                                <div className="border-t border-[#1c2b3a]/20 pt-4">
                                    <h3 className="text-sm font-medium text-[#1c2b3a]/80 mb-2">
                                        Convidados cadastrados
                                    </h3>
                                    <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
                                        {convidados.map((c) => (
                                            <div
                                                key={c.id}
                                                className="flex justify-between items-center bg-[#f8f9fa] hover:bg-[#eef1f4]
                           border border-[#1c2b3a]/10 rounded-xl px-4 py-3 text-sm text-[#1c2b3a]
                           transition-all duration-200"
                                            >
                                                <div className="flex-1">
                                                    {editandoConvidadoId === c.id ? (
                                                        <input
                                                            type="text"
                                                            value={novoNomeConvidado}
                                                            onChange={(e) => setNovoNomeConvidado(e.target.value)}
                                                            className="w-full border border-[#1c2b3a]/30 rounded-lg px-3 py-1 text-sm text-[#1c2b3a]"
                                                        />
                                                    ) : (
                                                        <span className="font-medium">{c.nome}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 ml-3">
                                                    {editandoConvidadoId === c.id ? (
                                                        <>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                onClick={() => editarConvidado(c.id!)}
                                                                className="p-1.5 rounded-full bg-green-100 hover:bg-green-200"
                                                            >
                                                                <Save className="w-4 h-4 text-green-600" />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                onClick={() => {
                                                                    setEditandoConvidadoId(null)
                                                                    setNovoNomeConvidado('')
                                                                }}
                                                                className="p-1.5 rounded-full bg-red-100 hover:bg-red-200"
                                                            >
                                                                <XCircle className="w-4 h-4 text-red-600" />
                                                            </motion.button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                onClick={() => {
                                                                    setEditandoConvidadoId(c.id!)
                                                                    setNovoNomeConvidado(c.nome)
                                                                }}
                                                                className="p-1.5 rounded-full bg-yellow-100 hover:bg-yellow-200"
                                                            >
                                                                <Edit3 className="w-4 h-4 text-yellow-600" />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                onClick={() => deletarConvidado(c.id!)}
                                                                className="p-1.5 rounded-full bg-red-100 hover:bg-red-200"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </motion.button>
                                                        </>
                                                    )}

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() =>
                                                            toggleStatus(
                                                                c.id!,
                                                                c.status === 'Confirmado'
                                                                    ? 'Não confirmado'
                                                                    : 'Confirmado'
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium shadow cursor-pointer
                                transition-all duration-200 ${c.status === 'Confirmado'
                                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                                                            }`}
                                                    >
                                                        {c.status === 'Confirmado'
                                                            ? 'Confirmado'
                                                            : 'Pendente'}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-2 pt-4 w-full">
                                <input
                                    type="text"
                                    placeholder="Nome do convidado"
                                    value={novoConvidado}
                                    onChange={(e) => setNovoConvidado(e.target.value)}
                                    className="w-[75%] border border-[#1c2b3a]/30 rounded-xl px-3 py-2.5 text-sm bg-white/90 text-[#1c2b3a]
                    shadow-inner focus:border-[#1c2b3a] outline-none transition-all duration-200"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={criarConvidado}
                                    className="h-[42px] w-[42px] flex items-center justify-center rounded-xl bg-[#1c2b3a]
                    text-white shadow hover:brightness-110 cursor-pointer transition-all duration-200"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setStep('listar')}
                                className="w-full py-3 rounded-2xl border border-[#1c2b3a]/30 text-[#1c2b3a]
                   text-sm mt-4 cursor-pointer hover:bg-[#f2f3f4]/70 transition-all"
                            >
                                ← Voltar para grupos
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    )
}
