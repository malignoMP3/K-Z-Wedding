import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
    const { data, error } = await supabase.from('grupos').select('*').order('id', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const { nome, telefone } = await req.json()
    const { data, error } = await supabase.from('grupos').insert([{ nome, telefone }]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: Request) {
    const { id, nome } = await req.json()
    if (!id || !nome) return NextResponse.json({ error: 'ID e nome são obrigatórios' }, { status: 400 })
    const { error } = await supabase.from('grupos').update({ nome }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })

    await supabase.from('convidados').delete().eq('grupo_id', id)
    const { error } = await supabase.from('grupos').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
