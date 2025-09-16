// import axios from 'axios';
// import { IPost } from '@/types/type/post';
// import { getServerApiUrl } from '@/hooks/useApiUrl';

// interface ApiResponse<T> {
//   message: string;
//   data: T;
// }

// export const getAllPosts = async (): Promise<IPost[]> => {
//   try {
//     const apiUrl = `${getServerApiUrl('/api/post')}`;
//     const res = await fetch(apiUrl);
//     if (!res.ok) throw new Error('Failed to fetch posts');
//     const json: ApiResponse<IPost[]> = await res.json();
//     return json.data;
//   } catch (err) {
//     console.error('Lỗi khi lấy danh sách bài viết:', err);
//     throw new Error('Không thể lấy danh sách bài viết');
//   }
// };

// export const createPost = async (formData: FormData): Promise<IPost> => {
//   try {
//     const res = await axios.post<ApiResponse<IPost>>('/api/post', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return res.data.data;
//   } catch (err) {
//     console.error('Lỗi khi tạo bài viết:', err);
//     throw new Error('Không thể tạo bài viết');
//   }
// };

// export const updatePost = async (id: string, formData: FormData): Promise<IPost> => {
//   try {
//     const res = await axios.put<ApiResponse<IPost>>(`/api/post/${id}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return res.data.data;
//   } catch (err) {
//     console.error('Lỗi khi cập nhật bài viết:', err);
//     throw new Error('Không thể cập nhật bài viết');
//   }
// };

// export const deletePost = async (id: string): Promise<void> => {
//   try {
//     await axios.delete(`/api/post/${id}`);
//   } catch (err) {
//     console.error('Lỗi khi xóa bài viết:', err);
//     throw new Error('Không thể xóa bài viết');
//   }
// };
