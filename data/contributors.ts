export interface Contributor {
  id: string
  name: string
  bio: string
  location: string
  twitter?: string
  github?: string
  avatar?: string
  joined: string
}

export const contributors: Contributor[] = [
  {
    id: 'chuka-onyekwere',
    name: 'Chuka Onyekwere',
    bio: 'n8n Ambassador based in Lagos. Building automation tooling for the African developer ecosystem. Co-organizer of the n8n Nigeria Community Tour.',
    location: 'Lagos, Nigeria',
    twitter: 'chuukkaa_OG',
    github: 'openstack-africa',
    joined: '2025-01-15',
  },
  {
    id: 'moses-otu',
    name: 'Moses Otu',
    bio: 'n8n Ambassador and automation engineer based in Abuja. Passionate about making workflow automation accessible to African developers.',
    location: 'Abuja, Nigeria',
    joined: '2025-01-20',
  },
  {
    id: 'adaeze-nwosu',
    name: 'Adaeze Nwosu',
    bio: 'Full-stack developer and automation enthusiast. Building tools that help Nigerian startups scale without hiring more engineers.',
    location: 'Enugu, Nigeria',
    joined: '2025-01-20',
  },
  {
    id: 'kelechi-agu',
    name: 'Kelechi Agu',
    bio: 'Backend engineer focused on fintech integrations. Contributor to open source projects across the African tech ecosystem.',
    location: 'Port Harcourt, Nigeria',
    joined: '2025-01-22',
  },
  {
    id: 'tunde-fashola',
    name: 'Tunde Fashola',
    bio: 'Product engineer and n8n power user. Specializes in customer support automation for African e-commerce and logistics companies.',
    location: 'Lagos, Nigeria',
    joined: '2025-01-22',
  },
  {
    id: 'emeka-ibe',
    name: 'Emeka Ibe',
    bio: 'DevOps and automation engineer. Focused on helping African businesses reduce manual work through smart workflow automation.',
    location: 'Lagos, Nigeria',
    joined: '2025-01-25',
  },
  {
    id: 'amara-ike',
    name: 'Amara Ike',
    bio: 'Software developer and fintech enthusiast based in Abuja. Interested in POS automation and business intelligence for SMEs.',
    location: 'Abuja, Nigeria',
    joined: '2025-01-28',
  },
]

export function getContributorById(id: string): Contributor | undefined {
  return contributors.find(c => c.id === id)
}

export function getContributorByName(name: string): Contributor | undefined {
  return contributors.find(c => c.name === name)
}

export function getContributorSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
