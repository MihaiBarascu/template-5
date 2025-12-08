import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'
import RichText from '@/components/RichText'

import { Width } from '../Width'

interface MessageProps {
  message?: DefaultTypedEditorState | null
  blockType?: string
  id?: string | null
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  if (!message || !('root' in message)) {
    return null
  }

  return (
    <Width className="my-4" width="100">
      <RichText data={message} enableGutter={false} />
    </Width>
  )
}
