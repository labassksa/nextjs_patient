import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Call MyFatoorah ExecutePayment endpoint
    const response = await fetch('https://api.myfatoorah.com/v2/ExecutePayment', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        SessionId: body.sessionId,
        InvoiceValue: body.amount
        // Add other required fields
      })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Execute payment error:', error);
    return NextResponse.json({ error: 'Payment execution failed' }, { status: 500 });
  }
} 