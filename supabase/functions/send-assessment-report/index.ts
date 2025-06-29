import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
console.log("Loaded RESEND_API_KEY?", !!Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// MBTI Questions data structure (subset needed for calculation)
interface MBTIQuestion {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: 'positive' | 'negative';
}

// MBTI calculation logic moved into the edge function
interface MBTIScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

interface MBTIResult {
  type: string;
  scores: MBTIScores;
}

// Simplified MBTI questions structure for calculation
const mbtiQuestions: MBTIQuestion[] = [
  // EI dimension (23 questions)
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' },
  
  // SN dimension (23 questions)
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' },
  
  // TF dimension (23 questions)
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' },
  
  // JP dimension (24 questions)
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' }
];

const calculateMBTIType = (responses: number[]): MBTIResult => {
  const scores: MBTIScores = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };

  responses.forEach((response, index) => {
    const question = mbtiQuestions[index];
    if (!question) return;

    // Convert response (1-7) to score (-3 to +3)
    const score = response - 4;

    switch (question.dimension) {
      case 'EI':
        if (question.direction === 'positive') {
          scores.E += score;
          scores.I -= score;
        } else {
          scores.I += score;
          scores.E -= score;
        }
        break;
      case 'SN':
        if (question.direction === 'positive') {
          scores.S += score;
          scores.N -= score;
        } else {
          scores.N += score;
          scores.S -= score;
        }
        break;
      case 'TF':
        if (question.direction === 'positive') {
          scores.T += score;
          scores.F -= score;
        } else {
          scores.F += score;
          scores.T -= score;
        }
        break;
      case 'JP':
        if (question.direction === 'positive') {
          scores.J += score;
          scores.P -= score;
        } else {
          scores.P += score;
          scores.J -= score;
        }
        break;
    }
  });

  // Normalize scores to positive values
  const normalizedScores = {
    E: scores.E + 69, // 23 questions * 3 max score
    I: scores.I + 69,
    S: scores.S + 69, // 23 questions * 3 max score  
    N: scores.N + 69,
    T: scores.T + 69, // 23 questions * 3 max score
    F: scores.F + 69,
    J: scores.J + 72, // 24 questions * 3 max score
    P: scores.P + 72
  };

  // Determine type
  const type = 
    (normalizedScores.E > normalizedScores.I ? 'E' : 'I') +
    (normalizedScores.S > normalizedScores.N ? 'S' : 'N') +
    (normalizedScores.T > normalizedScores.F ? 'T' : 'F') +
    (normalizedScores.J > normalizedScores.P ? 'J' : 'P');

  return {
    type,
    scores: normalizedScores
  };
};

// Enhanced MBTI Types data with comprehensive information
const mbtiTypes: Record<string, any> = {
  "INTJ": {
    name: "The Architect",
    description: "Imaginative and strategic thinkers, with a plan for everything. INTJs are independent, decisive, and highly competent. They are natural leaders who focus on implementing their vision efficiently.",
    strengths: ["Strategic thinking", "Independent", "Decisive", "Hardworking", "Determined", "Confident", "Visionary", "Analytical"],
    weaknesses: ["Overly critical", "Judgmental", "Loathe highly structured environments", "Clueless in romance", "Arrogant"],
    careers: ["Scientist", "Engineer", "Consultant", "Analyst", "Manager", "Researcher", "Architect", "Investment Banker"],
    workStyle: "Prefer working independently on complex problems with minimal supervision. Excel in strategic planning and long-term vision implementation.",
    communication: "Direct and concise. Prefer written communication for complex ideas. May seem blunt but value efficiency over diplomacy.",
    leadership: "Natural strategic leaders who inspire through competence and vision. Focus on long-term goals and systematic improvement.",
    stress: "Become overwhelmed by too much external stimulation or when forced to focus on mundane details for extended periods."
  },
  "INTP": {
    name: "The Thinker",
    description: "Innovative inventors with an unquenchable thirst for knowledge. INTPs are logical, independent, and intellectually curious. They love theoretical and abstract concepts and seek to understand how things work.",
    strengths: ["Logical", "Objective", "Creative", "Curious", "Independent", "Analytical", "Innovative", "Flexible"],
    weaknesses: ["Insensitive", "Absent-minded", "Condescending", "Loathe rules and guidelines", "Second-guess themselves"],
    careers: ["Scientist", "Researcher", "Analyst", "Engineer", "Programmer", "Professor", "Philosopher", "Mathematician"],
    workStyle: "Thrive in flexible environments that allow for independent exploration of ideas. Need autonomy and intellectual stimulation.",
    communication: "Precise and logical. May struggle with emotional communication. Prefer discussing ideas over small talk.",
    leadership: "Lead through expertise and innovation rather than traditional authority. Inspire others with their knowledge and insights.",
    stress: "Become stressed when forced into highly social situations or when required to make decisions without sufficient analysis time."
  },
  "ENTJ": {
    name: "The Commander",
    description: "Bold, imaginative and strong-willed leaders, always finding a way – or making one. ENTJs are strategic, efficient, and excellent at organizing people and resources to achieve their vision.",
    strengths: ["Efficient", "Energetic", "Self-confident", "Strong-willed", "Strategic", "Charismatic", "Inspiring", "Decisive"],
    weaknesses: ["Stubborn", "Impatient", "Arrogant", "Poor handling of emotions", "Cold and ruthless"],
    careers: ["Executive", "Manager", "Entrepreneur", "Consultant", "Judge", "Scientist", "Investment Banker", "Lawyer"],
    workStyle: "Natural leaders who excel in fast-paced, challenging environments. Prefer positions with authority and responsibility.",
    communication: "Direct, confident, and persuasive. Excellent at presenting ideas and motivating others toward goals.",
    leadership: "Born leaders who inspire through vision and determination. Excel at organizing teams and resources efficiently.",
    stress: "Become frustrated when progress is slow or when dealing with inefficiency and incompetence in others."
  },
  "ENTP": {
    name: "The Debater",
    description: "Smart and curious thinkers who cannot resist an intellectual challenge. ENTPs are innovative, clever, and expressive. They are excited by new ideas and possibilities and love to explore concepts through discussion.",
    strengths: ["Innovative", "Enthusiastic", "Strategic", "Charismatic", "Energetic", "Perceptive", "Quick thinkers", "Original"],
    weaknesses: ["Very argumentative", "Insensitive", "Intolerant", "Find it difficult to focus", "Dislike practical matters"],
    careers: ["Entrepreneur", "Consultant", "Inventor", "Journalist", "Lawyer", "Scientist", "Marketing Manager", "Psychologist"],
    workStyle: "Thrive in dynamic environments with variety and intellectual challenges. Need freedom to explore new ideas and approaches.",
    communication: "Engaging and persuasive speakers. Love debating ideas and can see multiple perspectives on issues.",
    leadership: "Inspire through innovation and enthusiasm. Excel at generating ideas and motivating teams toward creative solutions.",
    stress: "Become stressed when confined to routine tasks or when forced to focus on mundane details for extended periods."
  },
  "INFJ": {
    name: "The Advocate",
    description: "Creative and insightful, inspired and independent. INFJs are complex individuals who seek meaning and authenticity. They are visionary, determined, and committed to helping others realize their potential.",
    strengths: ["Insightful", "Creative", "Inspiring", "Decisive", "Determined", "Altruistic", "Passionate", "Idealistic"],
    weaknesses: ["Sensitive", "Extremely private", "Perfectionist", "Always need to have a cause", "Can burn out easily"],
    careers: ["Counselor", "Writer", "Artist", "Psychologist", "Teacher", "Human Resources", "Social Worker", "Designer"],
    workStyle: "Work best in quiet, harmonious environments where they can focus on meaningful projects that align with their values.",
    communication: "Thoughtful and empathetic communicators. Prefer deep, meaningful conversations over small talk.",
    leadership: "Lead through inspiration and by example. Focus on developing others and creating positive change.",
    stress: "Become overwhelmed by conflict, criticism, or when their values are compromised. Need time alone to recharge."
  },
  "INFP": {
    name: "The Mediator",
    description: "Poetic, kind and altruistic people, always eager to help a good cause. INFPs are idealistic and loyal to their values. They are curious about possibilities and focus on understanding people and helping them fulfill their potential.",
    strengths: ["Idealistic", "Loyal", "Adaptable", "Curious", "Perceptive", "Passionate", "Creative", "Empathetic"],
    weaknesses: ["Too idealistic", "Too altruistic", "Impractical", "Dislike dealing with data", "Take things personally"],
    careers: ["Writer", "Counselor", "Teacher", "Artist", "Psychologist", "Social Worker", "Musician", "Designer"],
    workStyle: "Need autonomy and flexibility to work on projects that align with their values. Prefer collaborative, supportive environments.",
    communication: "Gentle and encouraging. Excel at understanding others' perspectives and providing emotional support.",
    leadership: "Lead through inspiration and by fostering individual growth. Create inclusive, values-driven environments.",
    stress: "Become stressed by conflict, criticism, or rigid structures that conflict with their values."
  },
  "ENFJ": {
    name: "The Protagonist",
    description: "Charismatic and inspiring leaders, able to mesmerize their listeners. ENFJs are warm, empathetic, and responsible. They are skilled communicators who genuinely care about others and seek to help them grow.",
    strengths: ["Charismatic", "Inspiring", "Decisive", "Natural leaders", "Passionate", "Altruistic", "Empathetic", "Persuasive"],
    weaknesses: ["Overly idealistic", "Too selfless", "Too sensitive", "Fluctuating self-esteem", "Struggle to make tough decisions"],
    careers: ["Teacher", "Counselor", "Manager", "Consultant", "Psychologist", "Human Resources", "Social Worker", "Coach"],
    workStyle: "Excel in people-focused roles where they can inspire and develop others. Prefer collaborative, harmonious environments.",
    communication: "Excellent communicators who can inspire and motivate others. Skilled at reading emotional cues and responding appropriately.",
    leadership: "Natural leaders who inspire through charisma and genuine care for others. Excel at building consensus and team unity.",
    stress: "Become stressed when unable to help others or when facing conflict that threatens harmony."
  },
  "ENFP": {
    name: "The Campaigner",
    description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile. ENFPs are people-centered and focus on possibilities. They have excellent people skills and are genuinely interested in others.",
    strengths: ["Enthusiastic", "Creative", "Sociable", "Energetic", "Perceptive", "Warm", "Independent", "Optimistic"],
    weaknesses: ["Poor practical skills", "Find it difficult to focus", "Overthink things", "Get stressed easily", "Highly emotional"],
    careers: ["Counselor", "Teacher", "Artist", "Journalist", "Consultant", "Psychologist", "Marketing Manager", "Designer"],
    workStyle: "Thrive in dynamic, people-focused environments with variety and creative challenges. Need flexibility and autonomy.",
    communication: "Enthusiastic and engaging communicators. Excel at connecting with others and generating excitement about ideas.",
    leadership: "Inspire through enthusiasm and vision. Excel at motivating teams and fostering creativity and innovation.",
    stress: "Become stressed by routine, isolation, or when forced to focus on mundane details for extended periods."
  },
  "ISTJ": {
    name: "The Logistician",
    description: "Practical and fact-minded, reliable and responsible. ISTJs are organized, methodical, and persistent in their approach to work and life. They value tradition, loyalty, and hard work.",
    strengths: ["Organized", "Responsible", "Practical", "Detail-oriented", "Loyal", "Hardworking", "Reliable", "Patient"],
    weaknesses: ["Stubborn", "Insensitive", "Always by the book", "Judgmental", "Often unreasonably blame themselves"],
    careers: ["Accountant", "Auditor", "Manager", "Administrator", "Analyst", "Engineer", "Judge", "Military Officer"],
    workStyle: "Excel in structured environments with clear procedures and expectations. Prefer working independently on detailed tasks.",
    communication: "Clear, direct, and factual. Prefer written communication for important matters. Value accuracy and precision.",
    leadership: "Lead through example and reliability. Excel at maintaining standards and ensuring consistent quality.",
    stress: "Become stressed by sudden changes, ambiguity, or when forced to make decisions without sufficient information."
  },
  "ISFJ": {
    name: "The Protector",
    description: "Warm-hearted and dedicated, always ready to protect loved ones. ISFJs are practical helpers who value stability and tradition. They are considerate, reliable, and committed to meeting others' needs.",
    strengths: ["Caring", "Reliable", "Patient", "Practical", "Supportive", "Detail-oriented", "Loyal", "Hardworking"],
    weaknesses: ["Humble and shy", "Take things too personally", "Repress their feelings", "Overload themselves", "Reluctant to change"],
    careers: ["Nurse", "Teacher", "Counselor", "Social Worker", "Administrator", "Human Resources", "Doctor", "Librarian"],
    workStyle: "Excel in supportive roles where they can help others. Prefer stable, harmonious environments with clear expectations.",
    communication: "Gentle and supportive. Excel at listening and providing emotional support. Prefer face-to-face communication.",
    leadership: "Lead through service and by taking care of others' needs. Create supportive, stable environments.",
    stress: "Become stressed by conflict, criticism, or when unable to meet others' expectations."
  },
  "ESTJ": {
    name: "The Executive",
    description: "Excellent administrators, unsurpassed at managing things or people. ESTJs are practical, realistic, and decisive. They are natural organizers who focus on getting results efficiently and systematically.",
    strengths: ["Organized", "Practical", "Reliable", "Decisive", "Clear", "Dedicated", "Strong-willed", "Efficient"],
    weaknesses: ["Inflexible", "Uncomfortable with unconventional situations", "Judgmental", "Too focused on social status", "Difficult to relax"],
    careers: ["Manager", "Administrator", "Supervisor", "Judge", "Teacher", "Banker", "Military Officer", "Executive"],
    workStyle: "Excel in leadership roles with clear authority and responsibility. Prefer structured environments with defined procedures.",
    communication: "Direct, clear, and authoritative. Excel at giving instructions and organizing group activities.",
    leadership: "Natural leaders who excel at organizing people and resources. Focus on efficiency and achieving concrete results.",
    stress: "Become stressed by ambiguity, inefficiency, or when others don't follow established procedures."
  },
  "ESFJ": {
    name: "The Consul",
    description: "Extraordinarily caring, social and popular people, always eager to help. ESFJs are warm-hearted and conscientious. They seek harmony and are skilled at managing people and coordinating group efforts.",
    strengths: ["Caring", "Social", "Organized", "Practical", "Supportive", "Reliable", "Loyal", "Sensitive to others"],
    weaknesses: ["Worried about their social status", "Inflexible", "Vulnerable to criticism", "Often too needy", "Too selfless"],
    careers: ["Teacher", "Nurse", "Manager", "Counselor", "Social Worker", "Event Planner", "Human Resources", "Administrator"],
    workStyle: "Excel in people-focused roles where they can help and support others. Prefer collaborative, harmonious environments.",
    communication: "Warm, supportive, and encouraging. Excel at building relationships and maintaining group harmony.",
    leadership: "Lead through service and by taking care of team members' needs. Excel at building consensus and team spirit.",
    stress: "Become stressed by conflict, criticism, or when unable to please everyone."
  },
  "ISTP": {
    name: "The Virtuoso",
    description: "Bold and practical experimenters, masters of all kinds of tools. ISTPs are flexible and tolerant, taking a pragmatic approach focused on immediate results. They are quiet and reserved but can be spontaneous.",
    strengths: ["Practical", "Flexible", "Realistic", "Hands-on", "Adaptable", "Calm", "Independent", "Logical"],
    weaknesses: ["Stubborn", "Insensitive", "Private and reserved", "Easily bored", "Dislike commitment"],
    careers: ["Mechanic", "Engineer", "Technician", "Pilot", "Detective", "Athlete", "Carpenter", "Programmer"],
    workStyle: "Prefer hands-on work with tangible results. Need autonomy and flexibility to work at their own pace.",
    communication: "Concise and practical. Prefer action over words. May struggle with emotional or abstract discussions.",
    leadership: "Lead by example and through technical expertise. Prefer informal leadership roles.",
    stress: "Become stressed by too much structure, emotional demands, or when forced into highly social situations."
  },
  "ISFP": {
    name: "The Adventurer",
    description: "Flexible and charming artists, always ready to explore new possibilities. ISFPs are sensitive, kind, and aesthetically oriented. They value harmony and authenticity in their personal relationships.",
    strengths: ["Artistic", "Flexible", "Warm", "Sensitive", "Curious", "Passionate", "Imaginative", "Loyal"],
    weaknesses: ["Fiercely independent", "Unpredictable", "Easily stressed", "Overly competitive", "Fluctuating self-esteem"],
    careers: ["Artist", "Designer", "Musician", "Counselor", "Teacher", "Photographer", "Writer", "Veterinarian"],
    workStyle: "Need creative freedom and flexibility. Prefer working on projects that align with their values and interests.",
    communication: "Gentle and supportive. Prefer one-on-one conversations. May struggle to express themselves in groups.",
    leadership: "Lead through inspiration and by example. Prefer informal leadership roles that allow for creativity.",
    stress: "Become stressed by conflict, criticism, or rigid structures that limit their creativity."
  },
  "ESTP": {
    name: "The Entrepreneur",
    description: "Smart, energetic and very perceptive people, truly enjoy living on the edge. ESTPs are spontaneous, pragmatic, and excellent in crisis situations. They prefer action over conversation and focus on immediate results.",
    strengths: ["Energetic", "Practical", "Spontaneous", "Rational", "Perceptive", "Direct", "Sociable", "Bold"],
    weaknesses: ["Insensitive", "Impatient", "Risk-prone", "Unstructured", "May miss the bigger picture"],
    careers: ["Sales Representative", "Marketing", "Entrepreneur", "Paramedic", "Detective", "Engineer", "Coach", "Pilot"],
    workStyle: "Thrive in fast-paced, dynamic environments with variety and immediate challenges. Prefer hands-on, practical work.",
    communication: "Direct, energetic, and persuasive. Excel at reading people and adapting their communication style accordingly.",
    leadership: "Lead through charisma and by taking action. Excel in crisis situations and motivating teams toward immediate goals.",
    stress: "Become stressed by too much planning, theoretical work, or when forced to work alone for extended periods."
  },
  "ESFP": {
    name: "The Entertainer",
    description: "Spontaneous, energetic and enthusiastic people – life is never boring around them. ESFPs are people-oriented and fun-loving. They make things more fun for others by their enjoyment and enthusiasm.",
    strengths: ["Enthusiastic", "Flexible", "Warm", "Spontaneous", "Practical", "People-focused", "Optimistic", "Creative"],
    weaknesses: ["Poor long-term planning", "Unfocused", "Easily stressed", "Overly sensitive", "Conflict-averse"],
    careers: ["Teacher", "Artist", "Counselor", "Sales Representative", "Event Planner", "Designer", "Social Worker", "Entertainer"],
    workStyle: "Excel in people-focused, dynamic environments with variety and social interaction. Need flexibility and positive feedback.",
    communication: "Warm, enthusiastic, and engaging. Excel at connecting with others and creating positive atmospheres.",
    leadership: "Lead through enthusiasm and by inspiring others. Excel at motivating teams and building morale.",
    stress: "Become stressed by conflict, isolation, or when forced to focus on abstract or theoretical work."
  }
};

// Function to generate dynamic personalized insights
const generatePersonalizedInsights = (scores: MBTIScores, type: string) => {
  const insights = [];

  // Energy Direction Insights
  const energyGap = Math.abs(scores.E - scores.I);
  if (type[0] === 'E') {
    if (energyGap > 30) {
      insights.push("**Strong Extraversion**: You have a very clear preference for Extraversion. You likely feel most energized when interacting with others and may find isolation draining. Consider leveraging your natural networking abilities and collaborative spirit in your work.");
    } else if (energyGap > 15) {
      insights.push("**Moderate Extraversion**: While you prefer Extraversion, you also have some comfort with Introversion. This flexibility allows you to adapt to both social and solitary work situations effectively.");
    } else {
      insights.push("**Flexible Energy Direction**: Your energy preference is quite balanced. You can draw energy from both social interaction and quiet reflection, making you adaptable to various work environments.");
    }
  } else {
    if (energyGap > 30) {
      insights.push("**Strong Introversion**: You have a clear preference for Introversion. You likely do your best thinking in quiet environments and may need time alone to recharge after social interactions. Your depth of focus is a significant strength.");
    } else if (energyGap > 15) {
      insights.push("**Moderate Introversion**: While you prefer Introversion, you can also engage effectively in social situations. This balance allows you to contribute thoughtfully in groups while maintaining your need for reflection.");
    } else {
      insights.push("**Flexible Energy Direction**: Your energy preference is quite balanced. You can draw energy from both quiet reflection and social interaction, giving you versatility in different situations.");
    }
  }

  // Information Processing Insights
  const infoGap = Math.abs(scores.S - scores.N);
  if (type[1] === 'S') {
    if (infoGap > 30) {
      insights.push("**Strong Sensing Preference**: You have a clear preference for concrete, practical information. You excel at noticing details and working with real, tangible data. Your practical approach helps you implement ideas effectively.");
    } else {
      insights.push("**Balanced Information Processing**: While you lean toward Sensing, you can also appreciate abstract concepts and future possibilities. This gives you both practical grounding and innovative potential.");
    }
  } else {
    if (infoGap > 30) {
      insights.push("**Strong Intuitive Preference**: You have a clear preference for patterns, possibilities, and future potential. You excel at seeing the big picture and generating innovative ideas. Your visionary thinking is a key strength.");
    } else {
      insights.push("**Balanced Information Processing**: While you lean toward Intuition, you can also work effectively with concrete details when needed. This balance helps you both innovate and implement.");
    }
  }

  // Decision Making Insights
  const decisionGap = Math.abs(scores.T - scores.F);
  if (type[2] === 'T') {
    if (decisionGap > 30) {
      insights.push("**Strong Thinking Preference**: You have a clear preference for logical, objective decision-making. You excel at analyzing situations rationally and making tough decisions based on facts and principles.");
    } else {
      insights.push("**Balanced Decision Making**: While you prefer logical analysis, you also consider the human impact of decisions. This balance helps you make decisions that are both rational and considerate.");
    }
  } else {
    if (decisionGap > 30) {
      insights.push("**Strong Feeling Preference**: You have a clear preference for value-based, people-centered decision-making. You excel at considering the human impact and maintaining harmony while making decisions.");
    } else {
      insights.push("**Balanced Decision Making**: While you prefer considering values and people, you can also apply logical analysis when needed. This balance helps you make well-rounded decisions.");
    }
  }

  // Lifestyle Insights
  const lifestyleGap = Math.abs(scores.J - scores.P);
  if (type[3] === 'J') {
    if (lifestyleGap > 30) {
      insights.push("**Strong Judging Preference**: You have a clear preference for structure and closure. You excel at planning, organizing, and bringing projects to completion. Your reliability and follow-through are significant strengths.");
    } else {
      insights.push("**Balanced Lifestyle Approach**: While you prefer structure, you can also adapt to changing circumstances. This flexibility allows you to plan effectively while remaining open to new opportunities.");
    }
  } else {
    if (lifestyleGap > 30) {
      insights.push("**Strong Perceiving Preference**: You have a clear preference for flexibility and keeping options open. You excel at adapting to change and exploring new possibilities. Your spontaneity and adaptability are key strengths.");
    } else {
      insights.push("**Balanced Lifestyle Approach**: While you prefer flexibility, you can also work within structured environments when needed. This balance helps you adapt while still meeting deadlines and commitments.");
    }
  }

  return insights;
};

// Function to generate enhanced visual bar chart as HTML/CSS with proper labeling
const generateEnhancedBarChart = (scores: MBTIScores, type: string) => {
  const dimensions = [
    { name: 'Energy Direction', left: 'E - Extraversion', right: 'I - Introversion', leftScore: scores.E, rightScore: scores.I },
    { name: 'Information Processing', left: 'S - Sensing', right: 'N - Intuition', leftScore: scores.S, rightScore: scores.N },
    { name: 'Decision Making', left: 'T - Thinking', right: 'F - Feeling', leftScore: scores.T, rightScore: scores.F },
    { name: 'Lifestyle Approach', left: 'J - Judging', right: 'P - Perceiving', leftScore: scores.J, rightScore: scores.P }
  ];

  return dimensions.map(dim => {
    const total = dim.leftScore + dim.rightScore;
    const leftPercentage = Math.round((dim.leftScore / total) * 100);
    const rightPercentage = 100 - leftPercentage;
    const preferenceStrength = Math.abs(leftPercentage - rightPercentage) > 30 ? 'Strong preference' : 
                              Math.abs(leftPercentage - rightPercentage) > 15 ? 'Moderate preference' : 'Flexible';
    
    return `
      <div style="margin: 25px 0; padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #667eea;">
        <h4 style="text-align: center; margin: 0 0 15px 0; color: #2c3e50; font-size: 18px;">${dim.name}</h4>
        
        <!-- Labels at the ends -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; color: #374151; font-size: 14px;">
          <span>${dim.left}</span>
          <span>${dim.right}</span>
        </div>
        
        <!-- Enhanced bar chart -->
        <div style="position: relative; height: 35px; background: #e5e7eb; border-radius: 17px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
          <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${leftPercentage}%; background: linear-gradient(90deg, #3b82f6, #1d4ed8); border-radius: 17px 0 0 17px; transition: width 0.5s ease;"></div>
          <div style="position: absolute; right: 0; top: 0; height: 100%; width: ${rightPercentage}%; background: linear-gradient(90deg, #8b5cf6, #7c3aed); border-radius: 0 17px 17px 0; transition: width 0.5s ease;"></div>
          
          <!-- Percentage labels on the bar -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
            ${leftPercentage}% | ${rightPercentage}%
          </div>
        </div>
        
        <!-- Preference strength indicator -->
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: #6b7280; font-style: italic;">
          ${preferenceStrength}
        </div>
      </div>
    `;
  }).join('');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, responses } = await req.json();

    if (!email || !responses) {
      throw new Error("Email and responses are required");
    }

    console.log("Processing assessment report for email:", email);

    // Calculate result
    const result = calculateMBTIType(responses);
    const typeInfo = mbtiTypes[result.type] || { name: "Unknown Type", description: "Unable to determine type." };
    const personalizedInsights = generatePersonalizedInsights(result.scores, result.type);
    const enhancedBarChart = generateEnhancedBarChart(result.scores, result.type);

    console.log("Calculated MBTI type:", result.type);

    // Update the assessment record to mark results as sent
    const { error: updateError } = await supabase
      .from('assessments')
      .update({ results_sent: true })
      .eq('email', email)
      .eq('responses', JSON.stringify(responses));

    if (updateError) {
      console.error('Error updating assessment:', updateError);
    }

    // Generate comprehensive HTML email content with dark mode support
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light dark">
          <title>Your Comprehensive INTRA16 Assessment Report</title>
          <style>
            :root {
              color-scheme: light dark;
            }
            
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f5f7fa; 
            }
            
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #1a1a1a;
                color: #e5e5e5;
              }
            }
            
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 16px; 
              overflow: hidden; 
              box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
            }
            
            @media (prefers-color-scheme: dark) {
              .container {
                background: #2a2a2a;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
              }
            }
            
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 50px 40px; 
              text-align: center; 
            }
            
            .content { 
              padding: 40px; 
            }
            
            @media (prefers-color-scheme: dark) {
              .content {
                color: #e5e5e5;
              }
            }
            
            .type-badge { 
              background: linear-gradient(135deg, #667eea, #764ba2); 
              color: white; 
              padding: 12px 24px; 
              border-radius: 50px; 
              font-weight: bold; 
              font-size: 24px; 
              display: inline-block; 
              margin: 15px 0; 
              letter-spacing: 2px;
            }
            
            .section { 
              margin: 35px 0; 
              padding: 25px; 
              background: #f8fafc; 
              border-radius: 12px; 
              border-left: 5px solid #667eea; 
            }
            
            @media (prefers-color-scheme: dark) {
              .section {
                background: #333333;
                border-left-color: #8b5cf6;
              }
            }
            
            .insight-box {
              background: linear-gradient(135deg, #e3f2fd, #bbdefb);
              border-left: 5px solid #2196f3;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            
            @media (prefers-color-scheme: dark) {
              .insight-box {
                background: linear-gradient(135deg, #1a237e, #283593);
                color: #e3f2fd;
              }
            }
            
            .strength-section {
              background: linear-gradient(135deg, #d4edda, #c3e6cb);
              border-left: 5px solid #28a745;
            }
            
            @media (prefers-color-scheme: dark) {
              .strength-section {
                background: linear-gradient(135deg, #1b5e20, #2e7d32);
                color: #c8e6c9;
              }
            }
            
            .weakness-section {
              background: linear-gradient(135deg, #f8d7da, #f5c6cb);
              border-left: 5px solid #dc3545;
            }
            
            @media (prefers-color-scheme: dark) {
              .weakness-section {
                background: linear-gradient(135deg, #b71c1c, #c62828);
                color: #ffcdd2;
              }
            }
            
            .preference { 
              margin: 15px 0; 
              padding: 15px; 
              background: white; 
              border-radius: 8px; 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            @media (prefers-color-scheme: dark) {
              .preference {
                background: #404040;
                color: #e5e5e5;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              }
            }
            
            .footer { 
              background: #2c3e50; 
              color: white; 
              padding: 30px; 
              text-align: center; 
              font-size: 14px; 
            }
            
            h1 { 
              margin: 0; 
              font-size: 42px; 
              font-weight: 700;
            }
            
            h2 { 
              color: #2c3e50; 
              margin-top: 0; 
              font-size: 28px;
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
            }
            
            @media (prefers-color-scheme: dark) {
              h2 {
                color: #e5e5e5;
                border-bottom-color: #8b5cf6;
              }
            }
            
            h3 { 
              color: #34495e; 
              margin-top: 0; 
              font-size: 22px;
            }
            
            @media (prefers-color-scheme: dark) {
              h3 {
                color: #e5e5e5;
              }
            }
            
            h4 {
              color: #5a6c7d;
              font-size: 18px;
              margin-bottom: 15px;
            }
            
            @media (prefers-color-scheme: dark) {
              h4 {
                color: #b0b0b0;
              }
            }
            
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            
            @media (max-width: 600px) {
              .grid {
                grid-template-columns: 1fr;
              }
            }
            
            .card {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            @media (prefers-color-scheme: dark) {
              .card {
                background: #404040;
                color: #e5e5e5;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              }
            }
            
            .strength-item, .weakness-item {
              padding: 8px 12px;
              margin: 5px 0;
              border-radius: 6px;
              font-weight: 500;
            }
            
            .strength-item {
              background: #d4edda;
              color: #155724;
              border-left: 4px solid #28a745;
            }
            
            @media (prefers-color-scheme: dark) {
              .strength-item {
                background: #2e7d32;
                color: #c8e6c9;
              }
            }
            
            .weakness-item {
              background: #f8d7da;
              color: #721c24;
              border-left: 4px solid #dc3545;
            }
            
            @media (prefers-color-scheme: dark) {
              .weakness-item {
                background: #c62828;
                color: #ffcdd2;
              }
            }
            
            .career-tag {
              display: inline-block;
              background: #e3f2fd;
              color: #1976d2;
              padding: 6px 12px;
              margin: 4px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
            }
            
            @media (prefers-color-scheme: dark) {
              .career-tag {
                background: #1976d2;
                color: #e3f2fd;
              }
            }
            
            .score-summary {
              background: linear-gradient(135deg, #fff3cd, #ffeaa7);
              border: 1px solid #ffc107;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            
            @media (prefers-color-scheme: dark) {
              .score-summary {
                background: linear-gradient(135deg, #f57f17, #ff8f00);
                border-color: #ffb300;
                color: #fff;
              }
            }
            
            @media (max-width: 600px) {
              .container { margin: 10px; }
              .header { padding: 30px 20px; }
              .content { padding: 20px; }
              h1 { font-size: 32px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Comprehensive INTRA16 Report</h1>
              <p style="margin: 0; opacity: 0.9; font-size: 18px;">Discover your personality type and unlock your potential</p>
            </div>
            
            <div class="content">
              <!-- Personality Type Overview -->
              <div style="text-align: center; margin-bottom: 40px;">
                <h2>Your Personality Type</h2>
                <span class="type-badge">${result.type}</span>
                <h3 style="color: #667eea; margin: 10px 0;">${typeInfo.name}</h3>
                <p style="font-size: 18px; color: #5a6c7d; line-height: 1.8; max-width: 600px; margin: 0 auto;">${typeInfo.description}</p>
              </div>

              <!-- Enhanced Visual Preference Chart -->
              <div class="section">
                <h3>📊 Your Personality Preference Chart</h3>
                <p style="color: #6b7280; margin-bottom: 20px;">This chart shows the strength of your preferences across the four personality dimensions with percentages:</p>
                ${enhancedBarChart}
              </div>

              <!-- Dynamic Personalized Insights -->
              <div class="insight-box">
                <h3>💡 Your Personalized Insights</h3>
                <p style="margin-bottom: 20px;">Based on your specific scores and preference strengths:</p>
                ${personalizedInsights.map(insight => `<p style="margin: 15px 0; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 6px; border-left: 4px solid #2196f3;">${insight}</p>`).join('')}
              </div>

              <!-- Strengths and Development Areas -->
              <div class="grid">
                <div class="card strength-section">
                  <h3>💪 Your Key Strengths</h3>
                  ${typeInfo.strengths.map((strength: string) => `<div class="strength-item">✓ ${strength}</div>`).join('')}
                </div>
                <div class="card weakness-section">
                  <h3>🎯 Development Areas</h3>
                  ${typeInfo.weaknesses.map((weakness: string) => `<div class="weakness-item">→ ${weakness}</div>`).join('')}
                </div>
              </div>

              <!-- Work Style and Communication -->
              <div class="section">
                <h3>🏢 Your Work Style</h3>
                <p style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: 6px; margin: 10px 0;">${typeInfo.workStyle}</p>
                
                <h4>Communication Preferences:</h4>
                <p style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: 6px; margin: 10px 0;">${typeInfo.communication}</p>
                
                <h4>Leadership Style:</h4>
                <p style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: 6px; margin: 10px 0;">${typeInfo.leadership}</p>
              </div>

              <!-- Career Recommendations -->
              <div class="section">
                <h3>🚀 Career Recommendations</h3>
                <p style="margin-bottom: 20px;">Based on your personality type, you may find fulfillment in these career areas:</p>
                <div style="text-align: center;">
                  ${typeInfo.careers.map((career: string) => `<span class="career-tag">${career}</span>`).join('')}
                </div>
              </div>

              <!-- Stress Management -->
              <div class="section">
                <h3>😌 Stress Management</h3>
                <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px;">
                  <strong>What typically causes you stress:</strong>
                  <p style="margin: 10px 0 0 0;">${typeInfo.stress}</p>
                </div>
              </div>

              <!-- Understanding Your Results -->
              <div class="section">
                <h3>🎓 Understanding Your Results</h3>
                <p>Your personality type represents your natural preferences for how you direct your energy, take in information, make decisions, and approach the outside world. Remember that:</p>
                <ul style="line-height: 1.8;">
                  <li><strong>All types are equally valuable</strong> and have unique strengths and contributions</li>
                  <li><strong>You can develop skills</strong> outside your natural preferences through practice and awareness</li>
                  <li><strong>Type doesn't limit</strong> what you can achieve - it's a tool for understanding, not a box</li>
                  <li><strong>This is a starting point</strong> for self-understanding, growth, and better relationships</li>
                  <li><strong>Preferences can evolve</strong> over time as you grow and gain new experiences</li>
                </ul>
              </div>

              <!-- Next Steps -->
              <div class="insight-box">
                <h3>🎯 Recommended Next Steps</h3>
                <ol style="line-height: 1.8;">
                  <li><strong>Reflect on your results</strong> - Consider how well they match your self-perception</li>
                  <li><strong>Share with trusted colleagues</strong> - Discuss how this might improve your working relationships</li>
                  <li><strong>Apply insights at work</strong> - Use your strengths more intentionally and be aware of potential blind spots</li>
                  <li><strong>Develop your weaker preferences</strong> - Practice skills outside your comfort zone when needed</li>
                  <li><strong>Consider team dynamics</strong> - Understand how your type interacts with others on your team</li>
                </ol>
              </div>
            </div>
            
            <div class="footer">
              <h3 style="color: white; margin-top: 0;">Thank you for taking the INTRA16 Assessment!</h3>
              <p>This comprehensive report was generated based on your responses to 93 carefully crafted questions.</p>
              <p>For personalized coaching, team workshops, or organizational development programs, contact <strong>Linked Up Consulting</strong></p>
              <p style="margin-top: 20px; opacity: 0.8;">
                📧 info@linkedupconsulting.com | 📞 +971 (547) 708-621<br>
                🌐 Visit us for more personality development resources and services
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log("Attempting to send enhanced email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Linkedupconsulting - INTRA16 Assessment <info@duskydunes.com>",
      to: [email],
      subject: `Your Enhanced INTRA16 Report - ${result.type} (${typeInfo.name})`,
      html: htmlContent,
      reply_to: "support@linkedupconsulting.com",
      headers: {
        'X-Entity-Ref-ID': `assessment-${Date.now()}`,
      },
    });

    console.log("Resend API response:", JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message || emailResponse.error}`);
    }

    console.log("Enhanced email sent successfully with ID:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      recipient: email,
      type: result.type,
      enhanced: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-report function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);