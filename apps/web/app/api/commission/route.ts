import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

// Rate limiting store: Map<IP, {count, resetAt}>
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const commissionSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  email: z.string().email(),
  confirmEmail: z.string().email(),
  discordUsername: z.string().min(1),
  keyboardKitName: z.string().min(1),
  plateChoice: z.string().min(1),
  layout: z.string().min(1),
  stabilizers: z.string().min(1),
  switches: z.string().min(1),
  switchesLubing: z.enum(['No', 'Yes', 'Yes + Films', 'Yes + Films + Springs']),
  providingKeycaps: z.enum(['Yes', 'No']),
  returnShippingInsurance: z.enum(['Yes', 'No']),
  additionalNotes: z.string().optional(),
  agreedToTerms: z.boolean(),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
})

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'
  return ip
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const limit = rateLimitStore.get(ip)

  if (!limit) {
    // First request from this IP
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + 3600000, // 1 hour
    })
    return { allowed: true }
  }

  if (now > limit.resetAt) {
    // Reset window has passed
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + 3600000,
    })
    return { allowed: true }
  }

  // Still in the same window
  if (limit.count >= 3) {
    return {
      allowed: false,
      retryAfter: Math.ceil((limit.resetAt - now) / 1000),
    }
  }

  limit.count++
  return { allowed: true }
}

async function sendToDiscordWebhook(data: z.infer<typeof commissionSchema>): Promise<boolean> {
  const webhookUrl = "https://discord.com/api/webhooks/1475664928752013434/xyOF9nm7RCoawktVbcjmuRzBuwUwjfBZrQ2PpsM-PDYn7lwJval3wRwy6xjdHp7350t-"

  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not configured')
    return false
  }

  const embed = {
    title: '🎹 New Keyboard Commission Request',
    color: 0x5865F2,
    fields: [
      {
        name: '👤 Personal Information',
        value: `**Name:** ${data.name}\n**Country:** ${data.country}\n**Email:** ${data.email}\n**Discord:** ${data.discordUsername}`,
        inline: false,
      },
      {
        name: '⌨️ Keyboard Specifications',
        value: `**Kit Name:** ${data.keyboardKitName}\n**Layout:** ${data.layout}\n**Plate:** ${data.plateChoice}\n**Stabilizers:** ${data.stabilizers}\n**Switches:** ${data.switches}`,
        inline: false,
      },
      {
        name: '🔧 Services',
        value: `**Lubing:** ${data.switchesLubing}\n**Providing Keycaps:** ${data.providingKeycaps}\n**Return Shipping Insurance:** ${data.returnShippingInsurance}`,
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
  }

  if (data.additionalNotes) {
    embed.fields.push({
      name: '📝 Additional Notes',
      value: data.additionalNotes,
      inline: false,
    })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send Discord webhook:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const ip = getClientIP(request)
    const { allowed, retryAfter } = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = commissionSchema.parse(body)

    // Send to Discord webhook
    const discordSuccess = await sendToDiscordWebhook(validatedData)

    if (!discordSuccess) {
      return NextResponse.json(
        { message: 'Failed to process commission request' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Commission request submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Commission API error:', error)
    return NextResponse.json(
      { message: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
