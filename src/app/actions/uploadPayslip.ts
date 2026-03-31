'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function uploadPayslip(formData: FormData) {
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;
  const title = formData.get('title') as string;

  if (!file || !userId || !title) {
    return { error: 'Alle velden zijn verplicht.' };
  }

  // We should make sure we have the service role key working or hope it's Public
  try {
    const fileExt = file.name.split('.').pop() || 'pdf';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payslips')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return { error: `Fout bij uploaden van bestand: ${uploadError.message}` };
    }

    // Get the public URL for the file
    const { data: publicData } = supabase.storage
      .from('payslips')
      .getPublicUrl(fileName);

    // Save to database
    const { error: insertError } = await supabase
      .from('payslips')
      .insert({
        user_id: userId,
        title,
        file_url: publicData.publicUrl,
      });

    if (insertError) {
      console.error('Insert Error:', insertError);
      return { error: `Fout bij opslaan in database: ${insertError.message}` };
    }

    revalidatePath('/loonstroken');
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { error: 'Er is een onbekende fout opgetreden bij het uploaden.' };
  }
}
