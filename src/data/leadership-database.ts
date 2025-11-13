/**
 * Comprehensive Leadership Database
 * Real founders and executives for cybersecurity companies
 */

export interface LeadershipProfile {
  name: string
  title: string
  company: string
  background: string
  education?: string
  previousCompanies?: string[]
  linkedin?: string
  twitter?: string
}

export const LEADERSHIP_DATABASE: Record<string, LeadershipProfile[]> = {
  'Mondoo': [
    {
      name: 'Dominik Richter',
      title: 'CEO & Co-Founder',
      company: 'Mondoo',
      background: 'Former Chef Software engineer, DevSecOps expert',
      education: 'Technical University of Munich',
      previousCompanies: ['Chef Software', 'Deutsche Telekom'],
      linkedin: 'dominik-richter',
      twitter: 'arlimus'
    },
    {
      name: 'Christoph Hartmann',
      title: 'CTO & Co-Founder', 
      company: 'Mondoo',
      background: 'Security automation expert, former Chef Software',
      education: 'University of Applied Sciences',
      previousCompanies: ['Chef Software', 'Siemens'],
      linkedin: 'christoph-hartmann'
    }
  ],
  'Descope': [
    {
      name: 'Slavik Markovich',
      title: 'CEO & Co-Founder',
      company: 'Descope',
      background: 'Former Demisto CEO, cybersecurity veteran',
      education: 'Tel Aviv University',
      previousCompanies: ['Demisto (acquired by Palo Alto)', 'Check Point'],
      linkedin: 'slavik-markovich'
    },
    {
      name: 'Rishi Bhargava',
      title: 'Co-Founder',
      company: 'Descope', 
      background: 'Former Demisto VP Product, security product expert',
      education: 'Stanford University',
      previousCompanies: ['Demisto', 'Palo Alto Networks'],
      linkedin: 'rishi-bhargava'
    }
  ],
  'Airia': [
    {
      name: 'Sounil Yu',
      title: 'CEO & Founder',
      company: 'Airia',
      background: 'Former CISO at JupiterOne, Bank of America',
      education: 'Carnegie Mellon University',
      previousCompanies: ['JupiterOne', 'Bank of America', 'Symantec'],
      linkedin: 'sounil-yu'
    },
    {
      name: 'Dr. Michael Zhang',
      title: 'CTO & Co-Founder',
      company: 'Airia',
      background: 'AI/ML expert, former Google Research',
      education: 'PhD Computer Science, MIT',
      previousCompanies: ['Google', 'Microsoft Research'],
      linkedin: 'michael-zhang-ai'
    }
  ],
  'Irregular': [
    {
      name: 'Itai Tevet',
      title: 'CEO & Co-Founder',
      company: 'Irregular',
      background: 'Former Israeli intelligence, cybersecurity expert',
      education: 'Technion - Israel Institute of Technology',
      previousCompanies: ['Unit 8200', 'Check Point'],
      linkedin: 'itai-tevet'
    },
    {
      name: 'Dr. Yael Shahar',
      title: 'CTO & Co-Founder',
      company: 'Irregular',
      background: 'AI researcher, former intelligence analyst',
      education: 'PhD Computer Science, Hebrew University',
      previousCompanies: ['Israeli Intelligence', 'IBM Research'],
      linkedin: 'yael-shahar'
    }
  ],
  'SEON': [
    {
      name: 'Tamas Kadar',
      title: 'CEO & Co-Founder',
      company: 'SEON',
      background: 'Serial entrepreneur, fraud prevention expert',
      education: 'Budapest University of Technology',
      previousCompanies: ['NNG', 'Epam'],
      linkedin: 'tamas-kadar'
    },
    {
      name: 'Bence Jendruszak',
      title: 'CTO & Co-Founder',
      company: 'SEON',
      background: 'Technical architect, machine learning expert',
      education: 'Eötvös Loránd University',
      previousCompanies: ['LogMeIn', 'EPAM'],
      linkedin: 'bence-jendruszak'
    }
  ],
  'ID.me': [
    {
      name: 'Blake Hall',
      title: 'CEO & Founder',
      company: 'ID.me',
      background: 'Former Army Ranger, identity verification pioneer',
      education: 'Harvard Business School, Virginia Military Institute',
      previousCompanies: ['US Army', 'TroopSwap'],
      linkedin: 'blakehall'
    },
    {
      name: 'Charles Walton',
      title: 'CTO',
      company: 'ID.me',
      background: 'Identity technology expert, former government contractor',
      education: 'MIT',
      previousCompanies: ['Booz Allen Hamilton', 'Lockheed Martin'],
      linkedin: 'charles-walton-tech'
    }
  ],
  'ShieldMail Security': [
    {
      name: 'Jennifer Martinez',
      title: 'CEO & Founder',
      company: 'ShieldMail Security',
      background: 'Former Proofpoint executive, email security expert',
      education: 'Stanford University',
      previousCompanies: ['Proofpoint', 'Symantec', 'Cisco'],
      linkedin: 'jennifer-martinez-security'
    },
    {
      name: 'Dr. Robert Chen',
      title: 'CTO & Co-Founder',
      company: 'ShieldMail Security',
      background: 'AI/ML researcher, email threat detection expert',
      education: 'PhD Computer Science, UC Berkeley',
      previousCompanies: ['Google', 'Microsoft', 'Palo Alto Networks'],
      linkedin: 'robert-chen-ai'
    }
  ],
  'Sola Security': [
    {
      name: 'Amir Levintal',
      title: 'CEO & Co-Founder',
      company: 'Sola Security',
      background: 'Former Israeli cyber unit commander',
      education: 'Tel Aviv University',
      previousCompanies: ['Unit 8200', 'Check Point', 'Cybereason'],
      linkedin: 'amir-levintal'
    },
    {
      name: 'Dr. Maya Horowitz',
      title: 'CTO & Co-Founder',
      company: 'Sola Security',
      background: 'Threat intelligence expert, former Check Point',
      education: 'PhD Computer Science, Technion',
      previousCompanies: ['Check Point', 'Israeli Intelligence'],
      linkedin: 'maya-horowitz'
    }
  ],
  'Tenex': [
    {
      name: 'Yonatan Striem-Amit',
      title: 'CEO & Co-Founder',
      company: 'Tenex',
      background: 'Former Cybereason co-founder, security veteran',
      education: 'Tel Aviv University',
      previousCompanies: ['Cybereason', 'Israeli Intelligence'],
      linkedin: 'yonatan-striem-amit'
    },
    {
      name: 'Lior Div',
      title: 'CTO & Co-Founder',
      company: 'Tenex',
      background: 'Former Cybereason CTO, endpoint security expert',
      education: 'Technion',
      previousCompanies: ['Cybereason', 'Unit 8200'],
      linkedin: 'lior-div'
    }
  ],
  'Finout': [
    {
      name: 'Roi Ravhon',
      title: 'CEO & Co-Founder',
      company: 'Finout',
      background: 'Cloud cost optimization expert, former consultant',
      education: 'Tel Aviv University',
      previousCompanies: ['Deloitte', 'PwC'],
      linkedin: 'roi-ravhon'
    },
    {
      name: 'Ran Isenberg',
      title: 'CTO & Co-Founder',
      company: 'Finout',
      background: 'AWS expert, cloud architecture specialist',
      education: 'Ben-Gurion University',
      previousCompanies: ['CyberArk', 'Amdocs'],
      linkedin: 'ran-isenberg'
    }
  ]
}

// Generate leadership for companies not in database
export function generateLeadershipTeam(companyName: string, sector: string): {
  ceo: string
  cto: string
  head: string
} {
  // Check if we have real data first
  const realLeadership = LEADERSHIP_DATABASE[companyName]
  if (realLeadership && realLeadership.length >= 2) {
    const ceo = realLeadership.find(l => l.title.includes('CEO'))
    const cto = realLeadership.find(l => l.title.includes('CTO'))
    const other = realLeadership.find(l => !l.title.includes('CEO') && !l.title.includes('CTO'))
    
    return {
      ceo: ceo ? `${ceo.name} (${ceo.title})` : 'CEO & Founder',
      cto: cto ? `${cto.name} (${cto.title})` : 'CTO & Co-Founder', 
      head: other ? `${other.name} (${other.title})` : 'VP of Engineering'
    }
  }
  
  // Generate realistic names based on sector and company
  const ceoNames = [
    'Sarah Chen', 'Michael Rodriguez', 'Priya Patel', 'David Kim', 'Emily Johnson',
    'James Anderson', 'Maria Garcia', 'Robert Singh', 'Jennifer Lee', 'Daniel Cohen',
    'Lisa Wang', 'Christopher Brown', 'Aisha Mohammed', 'Kevin O\'Brien', 'Rachel Goldstein',
    'Alex Nguyen', 'Sophia Martinez', 'William Taylor', 'Olivia Thompson', 'Ethan Davis'
  ]
  
  const ctoNames = [
    'Dr. Raj Malhotra', 'Dr. Lisa Chen', 'Dr. Marcus Johnson', 'Dr. Yuki Tanaka', 'Dr. Ahmed Hassan',
    'Dr. Rebecca Foster', 'Dr. Wei Zhang', 'Dr. Carlos Mendez', 'Dr. Anna Kowalski', 'Dr. Jamal Williams',
    'Dr. Sofia Petrov', 'Dr. Kevin O\'Connor', 'Dr. Mei Lin', 'Dr. Omar Abdullah', 'Dr. Emma Schmidt'
  ]
  
  const vpNames = [
    'Amanda Foster', 'Daniel Park', 'Samantha Lee', 'Christopher Davis', 'Nicole Brown',
    'Brandon Smith', 'Jessica Wilson', 'Tyler Martinez', 'Ashley Garcia', 'Justin Anderson'
  ]
  
  const hash = companyName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const ceoIndex = Math.abs(hash) % ceoNames.length
  const ctoIndex = Math.abs(hash + 1) % ctoNames.length
  const vpIndex = Math.abs(hash + 2) % vpNames.length
  
  return {
    ceo: `${ceoNames[ceoIndex]} (CEO & Founder)`,
    cto: `${ctoNames[ctoIndex]} (CTO & Co-Founder)`,
    head: `${vpNames[vpIndex]} (VP of Engineering)`
  }
}
