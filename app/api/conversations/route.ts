import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/dal';

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to retrieve conversations' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Successfully retrieved conversations',
        data: { conversations: data },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error?.message
            : 'Failed to retrieve conversations',
      },
      { status: 500 }
    );
  }
}
