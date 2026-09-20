import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('🚪 Logout request received');

    // Clear the userId cookie
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    
    console.log('✅ Cookie deleted, user logged out');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logged out successfully',
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Logout error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}