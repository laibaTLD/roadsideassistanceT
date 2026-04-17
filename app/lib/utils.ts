import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves image URLs for Media Library images.
 * - External URLs (http/https) are returned as-is
 * - Relative paths (/uploads/...) are resolved to the backend API URL
 */
export function getImageSrc(path: string | undefined | null | any): string {
  if (!path) return ''
  
  // Convert to string if it's not already (handles objects, numbers, etc.)
  const pathStr = String(path)
  
  if (!pathStr) return ''

  // Already an absolute URL
  if (/^https?:\/\//i.test(pathStr)) {
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\b/i.test(pathStr)
    return isLocal ? pathStr : pathStr.replace(/^http:\/\//i, 'https://')
  }

  // Data URL
  if (pathStr.startsWith('data:')) return pathStr

  // Media Library path - resolve to backend URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
    (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000')
  const isLocalBase = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\b/i.test(baseUrl)
  const httpsBaseUrl = isLocalBase ? baseUrl : baseUrl.replace(/^http:\/\//i, 'https://')

  // Strip leading slash and /uploads/ if present to avoid double uploads in path
  let cleanPath = pathStr.replace(/^\//, '')
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.substring(8) // Remove 'uploads/'
  }

  // Return the resolved path with /uploads/ prefix
  return `${httpsBaseUrl}/uploads/${cleanPath}`
}
