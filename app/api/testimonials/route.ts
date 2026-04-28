import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const siteSlug = searchParams.get('siteSlug');

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is required');
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (siteId) queryParams.append('siteId', siteId);
    if (siteSlug) queryParams.append('siteSlug', siteSlug);

    const url = `${backendUrl}/api/testimonials${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend testimonials error:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch testimonials from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
