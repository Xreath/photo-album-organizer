import { AppLayout } from '../components/layout/AppLayout'

export function HomePage() {
    return (
        <AppLayout>
            <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Photo Albums</h1>
                <p className="text-gray-600">Your photo albums will appear here.</p>
            </div>
        </AppLayout>
    )
}
