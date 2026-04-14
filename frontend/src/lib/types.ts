export type Role = 'admin' | 'user'

export interface User {
  id: number
  username: string
  email: string
  role: Role
}

export interface DatabaseConnection {
  id: number
  name: string
  db_type: 'postgresql' | 'mysql' | 'mongodb' | 'clickhouse'
  host: string
  port: number
  database: string
  username: string
  created_at: string
}

export interface BatchJob {
  id: number
  connection: number
  table_name: string
  batch_size: number
  offset: number
  status: 'pending' | 'extracted' | 'submitted' | 'failed'
  raw_data: { columns: string[]; rows: Record<string, unknown>[] }
  edited_data: { columns: string[]; rows: Record<string, unknown>[] }
  created_at: string
  submitted_at: string | null
}

export interface StoredFile {
  id: number
  batch_job: number
  owner: number
  format: 'json' | 'csv'
  file_path: string
  source_meta: Record<string, string>
  created_at: string
  shared_with: number[]
}