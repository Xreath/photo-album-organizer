// PhotoUploader component - Drag and drop file upload area

import { useState, useRef, useCallback } from 'react'
import { Button } from '../ui/Button'
import { validateImageFiles } from '../../lib/validation'

interface PhotoUploaderProps {
    onUpload: (files: File[]) => Promise<void>
    isUploading: boolean
    uploadProgress: { current: number; total: number; percentage: number } | null
}

export function PhotoUploader({ onUpload, isUploading, uploadProgress }: PhotoUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files)

        // Validate files
        const validation = validateImageFiles(fileArray)
        if (!validation.valid) {
            setError(validation.error ?? 'Invalid files')
            return
        }

        setError(null)

        try {
            await onUpload(fileArray)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed')
        }
    }, [onUpload])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        if (isUploading) return

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFiles(files)
        }
    }, [handleFiles, isUploading])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFiles(files)
        }
        // Reset input so same file can be selected again
        e.target.value = ''
    }, [handleFiles])

    const openFilePicker = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="mb-6">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
          ${isUploading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
        `}
                onClick={isUploading ? undefined : openFilePicker}
            >
                {isUploading && uploadProgress ? (
                    // Upload progress
                    <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto">
                            <svg className="animate-spin text-blue-600 w-full h-full" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </div>
                        <p className="font-medium text-gray-900">
                            Uploading {uploadProgress.current} of {uploadProgress.total}...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.percentage}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    // Default state
                    <>
                        <svg
                            className="w-12 h-12 text-gray-400 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium text-gray-900">Drop photos here</span> or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                            JPEG, PNG, GIF, or WebP • Max 20MB per file
                        </p>
                    </>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            {/* Alternative button */}
            {!isUploading && (
                <div className="mt-4 text-center">
                    <Button variant="secondary" onClick={openFilePicker}>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Select Photos
                    </Button>
                </div>
            )}
        </div>
    )
}
