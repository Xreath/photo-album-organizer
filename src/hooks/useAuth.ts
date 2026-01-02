// useAuth hook - Authentication state management

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface UseAuthState {
    user: User | null
    isLoading: boolean
    error: string | null
}

interface UseAuthReturn extends UseAuthState {
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
    const [state, setState] = useState<UseAuthState>({
        user: null,
        isLoading: true,
        error: null,
    })

    // Listen for auth state changes
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setState({
                user: session?.user ?? null,
                isLoading: false,
                error: null,
            })
        })

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setState({
                    user: session?.user ?? null,
                    isLoading: false,
                    error: null,
                })
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // Sign up
    const signUp = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, error: null }))

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setState(prev => ({ ...prev, error: error.message }))
            throw new Error(error.message)
        }
    }, [])

    // Sign in
    const signIn = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, error: null }))

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setState(prev => ({ ...prev, error: error.message }))
            throw new Error(error.message)
        }
    }, [])

    // Sign out
    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            throw new Error(error.message)
        }
    }, [])

    return {
        ...state,
        signUp,
        signIn,
        signOut,
        isAuthenticated: state.user !== null,
    }
}
