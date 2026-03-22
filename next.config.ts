import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // TODO: 실제 Supabase 프로젝트 hostname으로 교체 (예: abcdefghij.supabase.co)
    domains: ['your-supabase-project.supabase.co'],
  },
}

export default nextConfig
