
import { supabase } from "@/integrations/supabase/client";

export const linkAssessmentsToUser = async (userId: string, userEmail: string) => {
  try {
    console.log('Linking assessments for user:', userId, userEmail);
    
    // Find all assessments with this email that don't have a user_id
    const { data: unlinkedAssessments, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('email', userEmail)
      .is('user_id', null);

    if (fetchError) {
      console.error('Error fetching unlinked assessments:', fetchError);
      return 0;
    }

    if (!unlinkedAssessments || unlinkedAssessments.length === 0) {
      console.log('No unlinked assessments found for this email');
      return 0;
    }

    console.log(`Found ${unlinkedAssessments.length} unlinked assessments to link`);

    let linkedCount = 0;

    // Update each assessment to link it to the user
    for (const assessment of unlinkedAssessments) {
      const { error: updateError } = await supabase
        .from('assessments')
        .update({ user_id: userId })
        .eq('id', assessment.id);

      if (updateError) {
        console.error('Error linking assessment:', assessment.id, updateError);
      } else {
        console.log('Successfully linked assessment:', assessment.id);
        linkedCount++;
      }
    }

    console.log(`Successfully linked ${linkedCount} assessments`);
    return linkedCount;
  } catch (error) {
    console.error('Error in linkAssessmentsToUser:', error);
    return 0;
  }
};
