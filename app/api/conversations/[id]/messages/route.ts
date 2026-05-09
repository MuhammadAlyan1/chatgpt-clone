import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/dal';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createClient();

    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (conversationError) {
      return NextResponse.json(
        {
          error: conversationError.message || 'Conversation not found',
        },
        { status: 500 }
      );
    }
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { error: messagesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully retrieved conversation', data: { messages } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error?.message
            : 'Failed to retrieve conversation',
      },
      { status: 500 }
    );
  }
}
