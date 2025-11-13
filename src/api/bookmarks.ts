import type { Bookmark, BookmarkAnalytics, BookmarkCreate, CSVImportResponse , StandardResponse  } from '@/lib/types'
import { apiClient } from '@/lib/api'

const createBookmark = async (
  data: BookmarkCreate,
): Promise<StandardResponse> => {
  return apiClient.post('/api/v1/bookmark', data)
}

const getAllBookmarks = async (
  page = 1,
  per_page = 10,
): Promise<StandardResponse<Array<Bookmark>>> => {
  return apiClient.get(`/api/v1/bookmark?page=${page}&per_page=${per_page}`)
}

const deleteBookmark = async (id: string): Promise<StandardResponse> => {
  return apiClient.delete(`/api/v1/bookmark/${id}`)
}

const bulkDeleteBookmarks = async (
  ids: Array<string>,
): Promise<StandardResponse> => {
  return apiClient.delete(`/api/v1/bookmark/bulk`, {
    data: {
      ids,
    },
  })
}

const importFromCSV = async (file: File): Promise<StandardResponse<CSVImportResponse>> => {
  const formData = new FormData()
  formData.append('csv_file', file)
  return apiClient.post('/api/v1/bookmark/import-from-csv', formData , {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const getAnalytics = async (): Promise<StandardResponse<Array<BookmarkAnalytics>>> => {
  return apiClient.get('/api/v1/bookmark/analytics')
}

export const bookmarksApi = {
  createBookmark,
  getAllBookmarks,
  deleteBookmark,
  bulkDeleteBookmarks,
  importFromCSV,
  getAnalytics,
}
