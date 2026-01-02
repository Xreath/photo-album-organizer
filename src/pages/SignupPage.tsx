import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="mt-2 text-gray-600">Start organizing your photos today</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <p className="text-gray-600 text-center mb-4">Signup form coming soon...</p>
                    <div className="text-center">
                        <Link to="/">
                            <Button>Go to Home</Button>
                        </Link>
                    </div>
                </div>
                <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
