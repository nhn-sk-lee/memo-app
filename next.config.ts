import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // 환경변수를 직접 설정
    NEXT_PUBLIC_SUPABASE_URL: 'https://ozhiuonqggfqplhjklps.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aGl1b25xZ2dmcXBsaGprbHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjQ2MTYsImV4cCI6MjA2OTYwMDYxNn0.jG4J4zbpwSFydywr11Yz07F8c5iuYWTGfgnpX-O3M1s',
  },
}

export default nextConfig
