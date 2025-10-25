import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get IP from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'Unknown'
    
    // Try to get more info from ipapi
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (e) {
      // Fallback if ipapi fails
    }
    
    // Fallback response
    return NextResponse.json({
      ip: ip,
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      timezone: 'Unknown',
      org: 'Unknown'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch IP information' },
      { status: 500 }
    )
  }
}
