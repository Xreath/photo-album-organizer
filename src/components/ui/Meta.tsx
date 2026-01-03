// Meta component - Page title and metadata management

import { useEffect } from 'react'

interface MetaProps {
    title: string
    description?: string
}

export function Meta({ title, description }: MetaProps) {
    useEffect(() => {
        document.title = `${title} | Photo Album Organizer`

        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]')
            if (!metaDescription) {
                metaDescription = document.createElement('meta')
                metaDescription.setAttribute('name', 'description')
                document.head.appendChild(metaDescription)
            }
            metaDescription.setAttribute('content', description)
        }
    }, [title, description])

    return null
}
