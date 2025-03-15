import { NextResponse } from 'next/server';
import { createToken } from '../../../utils/jwt';

// Use existing admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  try {
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Admin credentials not configured:', { ADMIN_USERNAME: !!ADMIN_USERNAME, ADMIN_PASSWORD: !!ADMIN_PASSWORD });
      return NextResponse.json(
        { error: 'Authentication is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt:', { 
      providedUsername: username,
      expectedUsername: ADMIN_USERNAME,
      usernameMatch: username === ADMIN_USERNAME,
      passwordMatch: password === ADMIN_PASSWORD 
    });

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('Credentials matched, creating token');
      
      // Create JWT token with admin role
      const token = await createToken({ 
        username,
        role: 'admin'
      });

      if (!token) {
        return NextResponse.json(
          { error: 'Failed to create authentication token' },
          { status: 500 }
        );
      }
      
      // Create response with success message and redirect URL
      const response = NextResponse.json(
        { 
          success: true,
          redirectTo: '/dashboard'
        },
        { status: 200 }
      );

      // Set cookie in the response
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax' to allow redirect
        maxAge: 60 * 60 * 24 // 24 hours
      });

      console.log('Login successful, token created and cookie set');
      return response;
    }

    console.log('Invalid credentials provided');
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 