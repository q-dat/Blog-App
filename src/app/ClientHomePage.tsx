'use client';
import { useState, useEffect } from 'react';
import { IPost } from '@/types/type/post';
import { IPostCatalog } from '@/types/type/post-catalog';
import { getAllPostCatalogs } from '@/services/postCatalogService';
import Image from 'next/image';
import Link from 'next/link';

interface ClientPostManagerProps {
  initialPosts: IPost[];
}

export default function ClientHomePage({ initialPosts }: ClientPostManagerProps) {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [postCatalogs, setPostCatalogs] = useState<IPostCatalog[]>([]);

  const handleOpenPostModal = (post: IPost) => setSelectedPost(post);
  const handleCloseModal = () => setSelectedPost(null);

  // Lấy danh mục khi component mount
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const catalogs = await getAllPostCatalogs();
        setPostCatalogs(catalogs);
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
      }
    };

    fetchCatalogs();
  }, []);

  // Hàm lấy tên danh mục theo ID
  const getCatalogNameById = (id: string) => {
    const found = postCatalogs.find((cat) => cat._id === id);
    return found ? found.name.charAt(0).toUpperCase() + found.name.slice(1) : 'Không rõ';
  };

  // decodeHTML
  function decodeHTML(html: string): string {
    if (typeof window === 'undefined') return html; // SSR: bỏ qua decode
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <div className="w-full p-2 xl:p-10">
      <div className="my-4">
        <h1 className="w-full">
          <span className="text-3xl font-bold">Tài Liệu Học Tập - Fullstack Developer 2025 (Nguồn: Sưu tầm)</span> <br />
          <i className="text-xl font-semibold">Tác giả: Điểu Quốc Đạt</i>
        </h1>
        <p className="text-xl">
          <span className="font-semibold">Github:</span>
          <i className="text-blue-500">
            <Link target="_blank" href={'https://github.com/q-dat'}>
              &nbsp; https://github.com/q-dat
            </Link>
          </i>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {initialPosts.map((post) => (
          <div key={post._id} className="overflow-hidden rounded-sm border bg-white shadow transition hover:shadow-md">
            <Image width={350} height={350} src={post.imageUrl || '/fallback.jpg'} alt={post.title} className="h-[350px] w-full object-cover" />
            <div className="space-y-1 p-4">
              <p className="text-sm font-bold text-black">Danh mục: {getCatalogNameById(post.post_catalog_id)}</p>
              <h2 className="truncate text-xl font-semibold text-gray-900">{post.title.charAt(0).toUpperCase() + post.title.slice(1)}</h2>
              <p className="line-clamp-3 text-sm text-gray-600">{decodeHTML(post.content.replace(/<[^>]*>/g, ''))}</p>
              {/* Xem chi tiết */}
              <button
                onClick={() => handleOpenPostModal(post)}
                className="mt-2 inline-block rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bài viết chi tiết */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black/60 p-2 xl:p-0"
          onClick={handleCloseModal}
        >
          <div className="flex w-full flex-row items-end justify-between xl:w-5/6">
            <div className="break-words bg-black p-2 text-sm text-white xl:text-2xl">
              {selectedPost.title.charAt(0).toUpperCase() + selectedPost.title.slice(1)}
            </div>
            <div>
              <button onClick={handleCloseModal} className="bg-red-500 px-5 py-3 text-2xl text-white hover:text-gray-800 xl:px-4 xl:py-2">
                ×
              </button>
            </div>
          </div>
          <div
            className="h-full w-full cursor-default overflow-y-auto border-[8px] border-white bg-white shadow-lg xl:h-5/6 xl:w-5/6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          </div>
        </div>
      )}
    </div>
  );
}
