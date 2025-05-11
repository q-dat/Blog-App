'use client';
import { IPost } from '@/types/type/post';
import { IPostCatalog } from '@/types/type/post-catalog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Toastify } from '../helper/Toastify';
import JoditEditorWrapper from './JoditEditorWrapper';
import { getAllPosts, createPost, updatePost, deletePost } from '@/services/postService';
import { getAllPostCatalogs, createPostCatalog, updatePostCatalog, deletePostCatalog } from '@/services/postCatalogService';

interface PostFormData {
  title: string;
  post_catalog_id: string;
  imageUrl: FileList | null;
}

interface CatalogFormData {
  name: string;
}
interface ClientPostManagerProps {
  initialPosts: IPost[];
}
export default function ClientPostManager({ initialPosts }: ClientPostManagerProps) {
  const { register: postRegister, handleSubmit: handlePostSubmit, reset: resetPost, watch, setValue: setPostValue } = useForm<PostFormData>();
  const { register: catalogRegister, handleSubmit: handleCatalogSubmit, reset: resetCatalog, setValue: setCatalogValue } = useForm<CatalogFormData>();
  const [posts, setPosts] = useState<IPost[]>(initialPosts || []);
  const [postCatalogs, setPostCatalogs] = useState<IPostCatalog[]>([]);
  const [editingPost, setEditingPost] = useState<IPost | null>(null);
  const [editingCatalog, setEditingCatalog] = useState<IPostCatalog | null>(null);
  const [loading, setLoading] = useState({ posts: false, catalogs: true });
  const [error, setError] = useState({ posts: null as string | null, catalogs: null as string | null });
  const [loadingSubmit, setLoadingSubmit] = useState({ post: false, catalog: false });
  const [editorValue, setEditorValue] = useState('');
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  const watchImages = watch('imageUrl');

  const previewImage =
    watchImages && watchImages instanceof FileList && watchImages.length > 0 ? URL.createObjectURL(watchImages[0]) : editingPost?.imageUrl || '';

  // Fetch posts and catalogs
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading((prev) => ({ ...prev, posts: true }));
      setError((prev) => ({ ...prev, posts: null }));
      try {
        const res = await getAllPosts();
        setPosts(res);
      } catch (err) {
        console.error('Lỗi tải bài viết:', err);
        setError((prev) => ({ ...prev, posts: 'Không thể tải bài viết' }));
        Toastify('Tải bài viết thất bại!', 500);
      } finally {
        setLoading((prev) => ({ ...prev, posts: false }));
      }
    };

    const fetchCatalogs = async () => {
      setLoading((prev) => ({ ...prev, catalogs: true }));
      setError((prev) => ({ ...prev, catalogs: null }));
      try {
        const catalogs = await getAllPostCatalogs();
        setPostCatalogs(catalogs);
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
        setError((prev) => ({ ...prev, catalogs: 'Không thể tải danh mục' }));
        Toastify('Tải danh mục thất bại!', 500);
      } finally {
        setLoading((prev) => ({ ...prev, catalogs: false }));
      }
    };

    if (posts.length === 0) fetchPosts();
    if (postCatalogs.length === 0) fetchCatalogs();

    if (editingPost) {
      setEditorValue(editingPost.content || '');
      setPostValue('title', editingPost.title);
      setPostValue('post_catalog_id', editingPost.post_catalog_id);
    } else {
      setEditorValue('');
      resetPost();
    }

    if (editingCatalog) {
      setCatalogValue('name', editingCatalog.name);
    } else {
      resetCatalog();
    }

    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [editingPost, editingCatalog, posts.length, postCatalogs.length, setPostValue, resetPost, resetCatalog, setCatalogValue, previewImage]);

  // Submit post
  const onPostSubmit = async (data: PostFormData) => {
    setLoadingSubmit((prev) => ({ ...prev, post: true }));
    try {
      const formData = new FormData();
      formData.append('title', data.title.toLowerCase());
      formData.append('post_catalog_id', data.post_catalog_id);
      formData.append('content', editorValue);
      if (data.imageUrl && data.imageUrl.length > 0) {
        formData.append('imageUrl', data.imageUrl[0]);
      }

      let post: IPost;
      if (editingPost) {
        post = await updatePost(editingPost._id, formData);
        setPosts(posts.map((p) => (p._id === editingPost._id ? post : p)));
        setEditingPost(null);
        Toastify('Cập nhật bài viết thành công!', 200);
      } else {
        post = await createPost(formData);
        setPosts([...posts, post]);
        Toastify('Tạo bài viết thành công!', 201);
      }

      resetPost();
      setEditorValue('');
    } catch (err) {
      console.error('Lỗi lưu bài viết:', err);
      Toastify('Đã xảy ra lỗi!', 500);
    } finally {
      setLoadingSubmit((prev) => ({ ...prev, post: false }));
    }
  };

  // Submit catalog
  const onCatalogSubmit = async (data: CatalogFormData) => {
    setLoadingSubmit((prev) => ({ ...prev, catalog: true }));
    try {
      let catalog: IPostCatalog;
      if (editingCatalog) {
        catalog = await updatePostCatalog(editingCatalog._id!, {
          name: data.name.toLowerCase(),
        });
        setPostCatalogs(postCatalogs.map((cat) => (cat._id === editingCatalog._id ? catalog : cat)));
        setEditingCatalog(null);
        Toastify('Danh mục đã được cập nhật thành công!', 200);
      } else {
        catalog = await createPostCatalog({ name: data.name.toLowerCase() });
        setPostCatalogs([...postCatalogs, catalog]);
        Toastify('Danh mục đã được tạo thành công!', 201);
      }
      resetCatalog();
      setIsCatalogModalOpen(false);
    } catch (err) {
      console.error('Lỗi xử lý danh mục:', err);
      Toastify('Đã xảy ra lỗi!', 500);
    } finally {
      setLoadingSubmit((prev) => ({ ...prev, catalog: false }));
    }
  };

  // Delete post
  const handleDeletePost = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        await deletePost(id);
        setPosts(posts.filter((p) => p._id !== id));
        Toastify('Xóa bài viết thành công!', 200);
      } catch (err) {
        console.error('Lỗi xóa bài viết:', err);
        Toastify('Đã xảy ra lỗi!', 500);
      }
    }
  };

  // Delete catalog
  const handleDeleteCatalog = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      try {
        await deletePostCatalog(id);
        setPostCatalogs(postCatalogs.filter((cat) => cat._id !== id));
        Toastify('Danh mục đã được xóa thành công!', 200);
      } catch (err) {
        console.error('Lỗi xóa danh mục:', err);
        Toastify('Đã xảy ra lỗi!', 500);
      }
    }
  };

  // Edit post
  const handleEditPost = (post: IPost) => {
    setEditingPost(post);
    setPostValue('title', post.title);
    setPostValue('post_catalog_id', post.post_catalog_id);
    setEditorValue(post.content || '');
  };

  // Edit catalog
  const handleEditCatalog = (catalog: IPostCatalog) => {
    setEditingCatalog(catalog);
    setCatalogValue('name', catalog.name);
    setIsCatalogModalOpen(true);
  };

  // Cancel edit post
  const handleCancelEditPost = () => {
    setEditingPost(null);
    resetPost();
    setEditorValue('');
  };

  // Cancel edit catalog
  const handleCancelEditCatalog = () => {
    setEditingCatalog(null);
    resetCatalog();
    setIsCatalogModalOpen(false);
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancelEditCatalog();
    }
  };

  return (
    <div className="flex flex-col p-2 xl:flex-row xl:gap-6">
      {/* Danh sách bài viết */}
      <div className="mt-6 w-full xl:mt-0 xl:w-2/3">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Danh sách bài viết</h3>
        {loading.posts ? (
          <p>Đang tải...</p>
        ) : error.posts ? (
          <p className="text-red-500">{error.posts}</p>
        ) : posts.length === 0 ? (
          <p>Không có bài viết nào.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Hình ảnh</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Tiêu đề</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Danh mục</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Nội dung</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Ngày tạo</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Ngày cập nhật</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-4 py-2">
                      {post.imageUrl ? (
                        <Image src={post.imageUrl} alt="Hình bài viết" width={40} height={40} className="rounded-md object-cover" />
                      ) : (
                        'Không có ảnh'
                      )}
                    </td>
                    <td className="px-4 py-2">{post.title.charAt(0).toUpperCase() + post.title.slice(1)}</td>
                    <td className="px-4 py-2">{postCatalogs.find((cat) => cat._id === post.post_catalog_id)?.name || 'N/A'}</td>
                    <td className="line-clamp-2 px-4 py-2">
                      <div dangerouslySetInnerHTML={{ __html: post.content || 'N/A' }} />
                    </td>
                    <td className="px-4 py-2">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(post.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEditPost(post)} className="rounded-md bg-green-500 px-3 py-1 text-white hover:bg-green-600">
                          Sửa
                        </button>
                        <button onClick={() => handleDeletePost(post._id)} className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form bài viết và quản lý danh mục */}
      <div className="w-full rounded-xl bg-white p-4 shadow xl:w-1/3">
        <h2 className="mb-4 text-xl font-bold text-gray-800">{editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
        <form onSubmit={handlePostSubmit(onPostSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Tiêu đề *</label>
            <input
              type="text"
              {...postRegister('title')}
              placeholder="Nhập tiêu đề"
              className="mt-1 w-full rounded-md border p-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Danh mục *</label>
            <div className="flex gap-2">
              <select
                {...postRegister('post_catalog_id')}
                className="mt-1 w-full rounded-md border p-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              >
                <option value="">Chọn danh mục</option>
                {postCatalogs.map((catalog) => (
                  <option key={catalog._id} value={catalog._id}>
                    {catalog.name.charAt(0).toUpperCase() + catalog.name.slice(1)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(true)}
                className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                Quản lý danh mục
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Nội dung *</label>
            <JoditEditorWrapper value={editorValue} onChange={setEditorValue} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Hình ảnh (tùy chọn)</label>
            <input {...postRegister('imageUrl')} type="file" accept="image/*" className="mt-1 w-full text-sm" />
            {previewImage && (
              <div className="mt-2 h-20 w-20 overflow-hidden rounded-md border">
                <Image src={previewImage} alt="Xem trước" width={80} height={80} className="object-cover" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button disabled={loadingSubmit.post} type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              {loadingSubmit.post ? 'Đang xử lý...' : editingPost ? 'Cập nhật' : 'Tạo mới'}
            </button>
            {editingPost && (
              <button type="button" className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700" onClick={handleCancelEditPost}>
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Modal quản lý danh mục */}
        {isCatalogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
            <div className="w-full max-w-md rounded-xl bg-white p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-800">Quản lý danh mục</h3>
              {/* Form thêm/sửa danh mục */}
              <form onSubmit={handleCatalogSubmit(onCatalogSubmit)} className="mb-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tên danh mục *</label>
                  <input
                    type="text"
                    {...catalogRegister('name')}
                    placeholder="Nhập tên danh mục"
                    className="mt-1 w-full rounded-md border p-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={loadingSubmit.catalog}
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    {loadingSubmit.catalog ? 'Đang xử lý...' : editingCatalog ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={handleCancelEditCatalog}
                  >
                    Hủy
                  </button>
                </div>
              </form>
              {/* Danh sách danh mục */}
              <div className="max-h-60 overflow-y-auto">
                {loading.catalogs ? (
                  <p>Đang tải...</p>
                ) : error.catalogs ? (
                  <p className="text-red-500">{error.catalogs}</p>
                ) : postCatalogs.length === 0 ? (
                  <p>Không có danh mục nào.</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Tên danh mục</th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {postCatalogs.map((catalog) => (
                        <tr key={catalog._id}>
                          <td className="px-4 py-2">{catalog.name.charAt(0).toUpperCase() + catalog.name.slice(1)}</td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditCatalog(catalog)}
                                className="rounded-md bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteCatalog(catalog._id!)}
                                className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
