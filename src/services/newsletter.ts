import axios from 'axios'

import { supabase } from '@/lib/supabaseClient'

export interface NewsletterPayload {
  email: string
}

export async function submitNewsletter(payload: NewsletterPayload) {
  if (supabase) {
    const { error } = await supabase.from('subscriptions').insert({
      email: payload.email
    })

    if (error) {
      throw new Error(error.message)
    }

    return { source: 'supabase' as const }
  }

  await axios.post('https://jsonplaceholder.typicode.com/posts', payload)
  return { source: 'mock' as const }
}

