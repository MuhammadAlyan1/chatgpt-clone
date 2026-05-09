import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/dal';
import { generateResponse } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { conversationId?: string; message?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    let conversationId = body.conversationId;

    if (!conversationId) {
      const { data: created, error: createError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.slice(0, 50),
        })
        .select('id')
        .single();

      if (createError || !created) {
        return NextResponse.json(
          { error: createError?.message || 'Failed to create conversation' },
          { status: 500 }
        );
      }
      conversationId = created.id;
    } else {
      const { data: existing, error: lookupError } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (lookupError) {
        return NextResponse.json(
          {
            error:
              lookupError.message || 'Failed to retrieve existing conversation',
          },
          { status: 500 }
        );
      }

      if (!existing) {
        return NextResponse.json(
          { error: 'Failed to retrieve existing conversation' },
          { status: 404 }
        );
      }
    }

    const { error: userMessageError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sent_by: 'user',
      content: message,
    });

    if (userMessageError) {
      return NextResponse.json(
        { error: userMessageError.message },
        { status: 500 }
      );
    }

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    const assistantMessage = await generateResponse(message);

    const { error: assistantMessageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sent_by: 'assistant',
        content: assistantMessage,
      });

    if (assistantMessageError) {
      return NextResponse.json(
        {
          error: assistantMessageError.message || 'Failed to generate response',
        },
        { status: 500 }
      );
    }

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return NextResponse.json(
      {
        message: 'Successfully generated response',
        data: { conversationId, reply: assistantMessage },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error?.message
            : 'Failed to create conversation',
      },
      { status: 500 }
    );
  }
}
