import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

const ADMIN_PHONES = process.env.ADMIN_PHONES?.split(',').map(p => p.trim()) || []

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const telefone = searchParams.get('telefone')
    const grupoId = searchParams.get('grupo_id')

    if (grupoId) {
        const { data, error } = await supabase
            .from('convidados')
            .select('*')
            .eq('grupo_id', grupoId)
            .order('id', { ascending: true })
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    }

    if (!telefone) return NextResponse.json([])

    const clean = telefone.replace(/\D/g, '')
    if (ADMIN_PHONES.includes(clean)) {
        const { data, error } = await supabase.from('convidados').select('*').order('id', { ascending: true })
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    }

    const { data: grupo } = await supabase.from('grupos').select('id').eq('telefone', clean).maybeSingle()
    if (!grupo) return NextResponse.json([])

    const { data, error } = await supabase.from('convidados').select('*').eq('grupo_id', grupo.id).order('id', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const { nome, telefone, grupo_id, status } = await req.json()
    if (!nome || !telefone || !grupo_id) return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })

    const { data, error } = await supabase
        .from('convidados')
        .insert([{ nome, telefone, grupo_id, status }])
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: Request) {
    const { id, nome, status } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })

    const updateData: any = {}
    if (nome) updateData.nome = nome
    if (status) updateData.status = status

    const { error } = await supabase.from('convidados').update(updateData).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })

    const { error } = await supabase.from('convidados').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
