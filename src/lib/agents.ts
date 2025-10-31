import { PDFDocument, StandardFonts } from 'pdf-lib'
import fs from 'fs/promises'
import path from 'path'
import customerData from './mock-customer-data.json'

type CustomerData = {
  fullName: string
  creditScore: number
  status: string
}

type KycResult =
  | {
      status: 'success'
      data: CustomerData
    }
  | {
      status: 'error'
      message: string
    }

export async function runKycAgent(
  panNumber: string,
  fullMessageHistory: any[],
): Promise<KycResult> {
  console.log(`[Agent] Running KYC & Credit check for: ${panNumber}`)

  const user = (customerData as Record<string, CustomerData>)[panNumber]

  if (!user) {
    console.log(`[Agent] KYC FAILED: No user found with PAN ${panNumber}`)
    return {
      status: 'error',
      message: `Sorry, we couldn't find a record for the PAN: ${panNumber}. Please check the number and try again.`,
    }
  }

  if (user.status === 'rejected_high_risk') {
    console.log(`[Agent] KYC FAILED: User ${user.fullName} is high risk.`)
    return {
      status: 'error',
      message: `Sorry, ${user.fullName}, we are unable to approve a loan for your profile at this time.`,
    }
  }

  // Try to override the user's name using the latest PDF summary from chat history
  let resolvedUser: CustomerData = user
  try {
    for (let i = fullMessageHistory.length - 1; i >= 0; i--) {
      const m = fullMessageHistory[i]
      if (!m || typeof m.content !== 'string') continue
      // Heuristics: look for lines like "Name: Rohan Sharma" or "Full Name: Priya Singh"
      const match = m.content.match(/\b(?:Full\s+Name|Name)\s*:\s*([A-Za-z]+(?:\s+[A-Za-z]+){1,2})/i)
      if (match && match[1]) {
        const extractedName = match[1].trim()
        resolvedUser = { ...user, fullName: extractedName }
        break
      }
    }
  } catch {
    // If parsing fails, just keep the original user name
  }

  console.log(
    `[Agent] KYC SUCCESS: Found user ${resolvedUser.fullName} with score ${resolvedUser.creditScore}`,
  )

  return {
    status: 'success',
    data: resolvedUser,
  }
}

export async function runSanctionAgent(customer: CustomerData) {
  console.log(`[Agent] Running Sanction Agent for: ${customer.fullName}`)

  const sanctionedAmount = customer.creditScore * 1000
  const interestRate = 18 - customer.creditScore / 100

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText('Personal Loan Sanction Letter', {
    x: 50,
    y: height - 100,
    size: 30,
    font,
  })

  page.drawText(`Dear ${customer.fullName},`, {
    x: 50,
    y: height - 150,
    size: 18,
    font: normalFont,
  })

  page.drawText(
    'We are pleased to inform you that your personal loan has been sanctioned.',
    { x: 50, y: height - 200, size: 14, font: normalFont },
  )

  page.drawText(
    `Sanctioned Amount: Rs. ${sanctionedAmount.toLocaleString('en-IN')}`,
    { x: 50, y: height - 230, size: 16, font },
  )

  page.drawText(`Interest Rate: ${interestRate.toFixed(2)}% p.a.`, {
    x: 50,
    y: height - 260,
    size: 14,
    font: normalFont,
  })

  const pdfBytes = await pdfDoc.save()
  const fileName = `Sanction_Letter_${customer.fullName.replace(' ', '_')}_${Date.now()}.pdf`
  const filePath = path.join(process.cwd(), 'public', fileName)
  await fs.writeFile(filePath, pdfBytes)

  console.log(`[Agent] Generated PDF: /${fileName}`)

  return {
    sanctionedAmount,
    pdfUrl: `/${fileName}`,
  }
}

