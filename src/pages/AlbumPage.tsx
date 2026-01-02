import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/ui/Button'

export function AlbumPage() {
    const { albumId } = useParams<{ albumId: string }>()

    return (
        <AppLayout>
            <div className="mb-6">
                <Link to="/">
                    <Button variant="ghost" size="sm">
                        ← Back to Albums
                    </Button>
                </Link>
            </div>
            <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Album</h1>
                <p className="text-gray-600">Album ID: {albumId}</p>
                <p className="text-gray-600 mt-2">Photos will appear here.</p>
            </div>
        </AppLayout>
    )
}
