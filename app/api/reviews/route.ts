import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

/**
 * Review submission. Runs with the service role so the `reviews` table can be
 * locked down (no public write access). Validates input and enforces one
 * review per invitation link. Rate limiting is handled at the edge (middleware).
 */
export async function POST(req: Request) {
  try {
    const { customer_name, review, stars, invitation_link } = await req.json();

    if (!invitation_link || typeof invitation_link !== 'string') {
      return NextResponse.json({ error: 'Missing invitation reference.' }, { status: 400 });
    }

    const name = typeof customer_name === 'string' ? customer_name.trim().slice(0, 120) : '';
    const text = typeof review === 'string' ? review.trim().slice(0, 1000) : '';
    const rating = Number(stars);

    if (!name || !text) {
      return NextResponse.json({ error: 'Name and review message are required.' }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating.' }, { status: 400 });
    }

    // One review per invitation link (prevents spam / duplicates).
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('invitation_link', invitation_link)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'A review has already been submitted for this invitation.' }, { status: 409 });
    }

    const { error } = await supabase.from('reviews').insert({
      customer_name: name,
      review: text,
      stars: rating,
      invitation_link,
    });

    if (error) {
      console.error('REVIEWS INSERT ERROR:', error.message);
      return NextResponse.json({ error: 'Could not save your review. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('REVIEWS ERROR:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not save your review. Please try again.' }, { status: 500 });
  }
}
