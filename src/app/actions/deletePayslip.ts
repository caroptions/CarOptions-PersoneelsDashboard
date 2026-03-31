'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deletePayslip(payslipId: string, filePath: string) {
  try {
    // We should make sure we have the service role key working or hope it's Public
    // 1. Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('payslips')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      return { error: 'Kon het bestand niet verwijderen uit opslag.' };
    }

    // 2. Delete the record from the database
    const { error: dbError } = await supabase
      .from('payslips')
      .delete()
      .eq('id', payslipId);

    if (dbError) {
      console.error('Error deleting database record:', dbError);
      return { error: 'Kon gegevens niet verwijderen.' };
    }

    revalidatePath('/loonstroken');
    return { success: true };
  } catch (err: any) {
    console.error('Delete error', err);
    return { error: 'Er ging iets fout.' };
  }
}
