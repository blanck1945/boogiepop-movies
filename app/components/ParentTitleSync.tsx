'use client'

import { useEffect } from 'react'

export function ParentTitleSync({ title }: { title: string }) {
  useEffect(() => {
    try {
      window.parent.document.title = title
    } catch {}
  }, [title])

  return null
}
