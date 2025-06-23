
export interface MBTITypeInfo {
  name: string;
  description: string;
  strengths: string[];
  careers: string[];
}

export const mbtiTypes: Record<string, MBTITypeInfo> = {
  ISTJ: {
    name: "The Inspector",
    description: "Practical and fact-minded, reliable and responsible. ISTJs are organized, methodical, and persistent in their approach to work and life. They value tradition, loyalty, and hard work.",
    strengths: ["Organized", "Responsible", "Practical", "Detail-oriented", "Loyal", "Hardworking"],
    careers: ["Accountant", "Auditor", "Manager", "Administrator", "Analyst", "Engineer"]
  },
  ISFJ: {
    name: "The Protector",
    description: "Warm-hearted and dedicated, always ready to protect loved ones. ISFJs are practical helpers who value stability and tradition. They are considerate, reliable, and committed to meeting others' needs.",
    strengths: ["Caring", "Reliable", "Patient", "Practical", "Supportive", "Detail-oriented"],
    careers: ["Nurse", "Teacher", "Counselor", "Social Worker", "Administrator", "Human Resources"]
  },
  INFJ: {
    name: "The Advocate",
    description: "Creative and insightful, inspired and independent. INFJs are complex individuals who seek meaning and authenticity. They are visionary, determined, and committed to helping others realize their potential.",
    strengths: ["Insightful", "Creative", "Inspiring", "Decisive", "Determined", "Altruistic"],
    careers: ["Counselor", "Writer", "Artist", "Psychologist", "Teacher", "Human Resources"]
  },
  INTJ: {
    name: "The Architect",
    description: "Imaginative and strategic thinkers, with a plan for everything. INTJs are independent, decisive, and highly competent. They are natural leaders who focus on implementing their vision efficiently.",
    strengths: ["Strategic", "Independent", "Decisive", "Hardworking", "Determined", "Confident"],
    careers: ["Scientist", "Engineer", "Consultant", "Analyst", "Manager", "Researcher"]
  },
  ISTP: {
    name: "The Virtuoso",
    description: "Bold and practical experimenters, masters of all kinds of tools. ISTPs are flexible and tolerant, taking a pragmatic approach focused on immediate results. They are quiet and reserved but can be spontaneous.",
    strengths: ["Practical", "Flexible", "Realistic", "Hands-on", "Adaptable", "Calm"],
    careers: ["Mechanic", "Engineer", "Technician", "Pilot", "Detective", "Athlete"]
  },
  ISFP: {
    name: "The Adventurer",
    description: "Flexible and charming artists, always ready to explore new possibilities. ISFPs are sensitive, kind, and aesthetically oriented. They value harmony and authenticity in their personal relationships.",
    strengths: ["Artistic", "Flexible", "Warm", "Sensitive", "Curious", "Passionate"],
    careers: ["Artist", "Designer", "Musician", "Counselor", "Teacher", "Photographer"]
  },
  INFP: {
    name: "The Mediator",
    description: "Poetic, kind and altruistic people, always eager to help a good cause. INFPs are idealistic and loyal to their values. They are curious about possibilities and focus on understanding people and helping them fulfill their potential.",
    strengths: ["Idealistic", "Loyal", "Adaptable", "Curious", "Perceptive", "Passionate"],
    careers: ["Writer", "Counselor", "Teacher", "Artist", "Psychologist", "Social Worker"]
  },
  INTP: {
    name: "The Thinker",
    description: "Innovative inventors with an unquenchable thirst for knowledge. INTPs are logical, independent, and intellectually curious. They love theoretical and abstract concepts and seek to understand how things work.",
    strengths: ["Logical", "Objective", "Creative", "Curious", "Independent", "Analytical"],
    careers: ["Scientist", "Researcher", "Analyst", "Engineer", "Programmer", "Professor"]
  },
  ESTP: {
    name: "The Entrepreneur",
    description: "Smart, energetic and very perceptive people, truly enjoy living on the edge. ESTPs are spontaneous, pragmatic, and excellent in crisis situations. They prefer action over conversation and focus on immediate results.",
    strengths: ["Energetic", "Practical", "Spontaneous", "Rational", "Perceptive", "Direct"],
    careers: ["Sales Representative", "Marketing", "Entrepreneur", "Paramedic", "Detective", "Engineer"]
  },
  ESFP: {
    name: "The Entertainer",
    description: "Spontaneous, energetic and enthusiastic people – life is never boring around them. ESFPs are people-oriented and fun-loving. They make things more fun for others by their enjoyment and enthusiasm.",
    strengths: ["Enthusiastic", "Flexible", "Warm", "Spontaneous", "Practical", "People-focused"],
    careers: ["Teacher", "Artist", "Counselor", "Sales Representative", "Event Planner", "Designer"]
  },
  ENFP: {
    name: "The Campaigner",
    description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile. ENFPs are people-centered and focus on possibilities. They have excellent people skills and are genuinely interested in others.",
    strengths: ["Enthusiastic", "Creative", "Sociable", "Energetic", "Perceptive", "Warm"],
    careers: ["Counselor", "Teacher", "Artist", "Journalist", "Consultant", "Psychologist"]
  },
  ENTP: {
    name: "The Debater",
    description: "Smart and curious thinkers who cannot resist an intellectual challenge. ENTPs are innovative, clever, and expressive. They are excited by new ideas and possibilities and love to explore concepts through discussion.",
    strengths: ["Innovative", "Enthusiastic", "Strategic", "Charismatic", "Energetic", "Perceptive"],
    careers: ["Entrepreneur", "Consultant", "Inventor", "Journalist", "Lawyer", "Scientist"]
  },
  ESTJ: {
    name: "The Executive",
    description: "Excellent administrators, unsurpassed at managing things or people. ESTJs are practical, realistic, and decisive. They are natural organizers who focus on getting results efficiently and systematically.",
    strengths: ["Organized", "Practical", "Reliable", "Decisive", "Clear", "Dedicated"],
    careers: ["Manager", "Administrator", "Supervisor", "Judge", "Teacher", "Banker"]
  },
  ESFJ: {
    name: "The Consul",
    description: "Extraordinarily caring, social and popular people, always eager to help. ESFJs are warm-hearted and conscientious. They seek harmony and are skilled at managing people and coordinating group efforts.",
    strengths: ["Caring", "Social", "Organized", "Practical", "Supportive", "Reliable"],
    careers: ["Teacher", "Nurse", "Manager", "Counselor", "Social Worker", "Event Planner"]
  },
  ENFJ: {
    name: "The Protagonist",
    description: "Charismatic and inspiring leaders, able to mesmerize their listeners. ENFJs are warm, empathetic, and responsible. They are skilled communicators who genuinely care about others and seek to help them grow.",
    strengths: ["Charismatic", "Inspiring", "Decisive", "Natural leaders", "Passionate", "Altruistic"],
    careers: ["Teacher", "Counselor", "Manager", "Consultant", "Psychologist", "Human Resources"]
  },
  ENTJ: {
    name: "The Commander",
    description: "Bold, imaginative and strong-willed leaders, always finding a way – or making one. ENTJs are strategic, efficient, and excellent at organizing people and resources to achieve their vision.",
    strengths: ["Efficient", "Energetic", "Self-confident", "Strong-willed", "Strategic", "Charismatic"],
    careers: ["Executive", "Manager", "Entrepreneur", "Consultant", "Judge", "Scientist"]
  }
};
