// Database types for Supabase
// These types match the schema defined in supabase/migrations/001_initial_schema.sql

export interface Album {
    id: string
    user_id: string
    name: string
    position: string
    has_custom_order: boolean
    created_at: string
    updated_at: string
}

export interface Photo {
    id: string
    album_id: string
    storage_path: string
    filename: string
    position: string
    file_size: number
    width: number | null
    height: number | null
    created_at: string
    updated_at: string
}

export interface AlbumWithPhotos extends Album {
    photos: Photo[]
}

// Input types for mutations
export interface CreateAlbumInput {
    name: string
}

export interface UpdateAlbumInput {
    name?: string
    position?: string
}

export interface CreatePhotoInput {
    album_id: string
    file: File
}

export interface UpdatePhotoInput {
    position?: string
}

// Database schema type for Supabase client
export interface Database {
    public: {
        Tables: {
            albums: {
                Row: Album
                Insert: Omit<Album, 'id' | 'created_at' | 'updated_at'> & {
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Omit<Album, 'id'>>
            }
            photos: {
                Row: Photo
                Insert: Omit<Photo, 'id' | 'created_at' | 'updated_at'> & {
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Omit<Photo, 'id'>>
            }
        }
    }
}
