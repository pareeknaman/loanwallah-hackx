import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'

// Helper to parse form data in Next.js
const parseForm = async (
  req: NextRequest,
): Promise<{ fields: Record<string, any>; files: Record<string, { filepath: string; originalFilename: string }> }> => {
  const formData = await req.formData()
  const files: Record<string, { filepath: string; originalFilename: string }> = {}
  const fields: Record<string, any> = {}

  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      const file = value
      const fileBuffer = await file.arrayBuffer()
      const tempFilePath = `/tmp/${(file as any).name}` // Temp path
      await fs.writeFile(tempFilePath, Buffer.from(fileBuffer))
      files[key] = { filepath: tempFilePath, originalFilename: (file as any).name }
    } else {
      fields[key] = value
    }
  }

  return { fields, files }
}

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseForm(req)
    const file = files.file

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    // At this stage, file.filepath points to the temp file saved in /tmp
    // Further processing (PDF parsing + LLM summary) can be implemented here.
    return NextResponse.json({ response: `Received file: ${file.originalFilename}` })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process file.' }, { status: 500 })
  }
}
