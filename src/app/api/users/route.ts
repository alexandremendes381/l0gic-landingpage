import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    
    let body
    try {
      body = JSON.parse(rawBody)
    } catch (jsonError) {
      return NextResponse.json(
        { 
          error: 'JSON inválido', 
          details: jsonError instanceof Error ? jsonError.message : 'Erro de parse desconhecido'
        },
        { status: 400 }
      )  
    }
    
    const requiredFields = ['name', 'email', 'phone', 'position', 'birthDate', 'message']
    
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
        return NextResponse.json(
          { error: `Campo '${field}' é obrigatório e deve ser uma string não vazia` },
          { status: 400 }
        )
      }
    }

    const userData = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(userData, { status: 201 })
  } catch (error) {
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { 
          error: 'Formato JSON inválido',
          details: error.message
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor', 
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de usuários está funcionando',
    timestamp: new Date().toISOString()
  })
}