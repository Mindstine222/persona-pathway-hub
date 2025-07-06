
import { supabase } from "@/integrations/supabase/client";

export const linkAssessmentsToUser = async (userId: string, userEmail: string) => {
  try {
    console.log('Linking assessments for user:', userId, userEmail);
    
    // Find all assessments with this email that don't have a user_id OR have a different user_id
    const { data: unlinkedAssessments, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('email', userEmail)
      .or(`user_id.is.null,user_id.neq.${userId}`);

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

// Enhanced function to get all assessments for a user
export const getAllUserAssessments = async (userId: string, userEmail: string) => {
  try {
    console.log('Fetching all assessments for user:', userId, userEmail);
    
    // First, try to link any unlinked assessments
    const linkedCount = await linkAssessmentsToUser(userId, userEmail);
    if (linkedCount > 0) {
      console.log(`Linked ${linkedCount} previous assessments to user account`);
    }
    
    // Then fetch all assessments for this user - both by user_id AND by email
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .or(`user_id.eq.${userId},email.eq.${userEmail}`)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      return [];
    }

    // Remove any duplicates (same email + same mbti_type + similar timestamp)
    const uniqueAssessments = assessments?.filter((assessment, index, arr) => {
      const isDuplicate = arr.findIndex(other => 
        other.email === assessment.email && 
        other.mbti_type === assessment.mbti_type &&
        Math.abs(new Date(other.completed_at).getTime() - new Date(assessment.completed_at).getTime()) < 30000 // within 30 seconds
      ) < index;
      return !isDuplicate;
    }) || [];

    console.log('Final unique assessments:', uniqueAssessments);
    return uniqueAssessments;
  } catch (error) {
    console.error('Error in getAllUserAssessments:', error);
    return [];
  }
};

// Function to force link assessments when user logs in
export const forceReLinkAssessments = async (userId: string, userEmail: string) => {
  try {
    console.log('Force re-linking assessments for user after login:', userId, userEmail);
    
    // Update ALL assessments with this email to be linked to this user
    const { data: updatedAssessments, error: updateError } = await supabase
      .from('assessments')
      .update({ user_id: userId })
      .eq('email', userEmail)
      .select();

    if (updateError) {
      console.error('Error force linking assessments:', updateError);
      return 0;
    }

    const linkedCount = updatedAssessments?.length || 0;
    console.log(`Force linked ${linkedCount} assessments to user account`);
    
    return linkedCount;
  } catch (error) {
    console.error('Error in forceReLinkAssessments:', error);
    return 0;
  }
};
