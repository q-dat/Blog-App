'use client';
import { useState, useEffect } from 'react';
import { IPost } from '@/types/type/post';
import Image from 'next/image';
import Link from 'next/link';
import { images } from '../../public/images';
import { TbMilkshake } from 'react-icons/tb';

interface ClientPostManagerProps {
  initialPosts: IPost[];
}

export default function ClientHomePage({ initialPosts }: ClientPostManagerProps) {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  // Post modal
  const handleOpenPostModal = (post: IPost) => setSelectedPost(post);

  // Toggle QR modal
  const toggleDonateModal = () => setShowDonateModal((prev) => !prev);

  // Close Post modal
  const handleClosePostModal = () => setSelectedPost(null);

  // useEffect chỉ quản lý ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPost) handleClosePostModal();
        if (showDonateModal) setShowDonateModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedPost, showDonateModal]);

  return (
    <div className="w-full p-2 xl:p-10">
      <div className="my-4 flex flex-col items-start justify-center gap-2">
        {/* Title */}
        <h1 className="w-full">
          <span className="text-3xl font-bold">Tài Liệu Học Tập - Fullstack Developer 2025 (Nguồn: Sưu tầm)</span> <br />
          <i className="text-xl font-semibold">Tác giả: Điểu Quốc Đạt</i>
        </h1>
        {/* Github */}
        <p className="text-xl">
          <span className="font-semibold">Github:</span>
          <i className="text-blue-500">
            <Link target="_blank" href={'https://github.com/q-dat'}>
              &nbsp; https://github.com/q-dat
            </Link>
          </i>
        </p>
        {/* Button Quyên góp */}
        <div
          onClick={toggleDonateModal}
          className="inline-flex transform cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 px-4 py-2 text-xl font-semibold uppercase text-black shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          Quyên góp trà sữa <TbMilkshake className="mx-1 text-black" />
        </div>

        {/* Modal QR Donation */}
        {showDonateModal && (
          <div
            className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black/60 p-2 xl:p-0"
            onClick={() => setShowDonateModal(false)}
          >
            <div
              className="relative flex cursor-default flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-white px-2 py-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 bg-clip-text text-center text-2xl font-extrabold uppercase text-transparent drop-shadow-lg xl:text-4xl">
                Quyên góp trà sữa <TbMilkshake className="mx-1 text-black" />
              </h2>
              <Image src={images.QRACB} width={400} height={400} className="h-4/5 w-4/5 xl:h-[400px] xl:w-[400px]" alt="QR ACB Dieu Quoc Dat" />
              <p className="text-center text-lg font-bold">ACB - Dieu Quoc Dat - 30365767</p>
              <div className="rounded-lg bg-pink-50 p-4 text-center shadow-md">
                <div className="text-base text-black">
                  <p>💖 Cảm ơn các tình yêu! 💖</p>
                  <p>
                    Cảm ơn bạn đã ủng hộ trà sữa cho dự án. Mọi đóng góp đều giúp tôi “nạp năng lượng” để học tập và phát triển dự án, mang lại nhiều
                    giá trị hơn cho cộng đồng. ☕🚀
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDonateModal(false)}
                className="absolute right-1 top-1 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {initialPosts.map((post) => (
          <div
            onClick={() => handleOpenPostModal(post)}
            key={post._id}
            className="cursor-pointer overflow-hidden rounded-sm border bg-white shadow transition hover:shadow-md"
          >
            <Image width={300} height={300} src={post.imageUrl || images.FallBack} alt={post.title} className="h-[300px] w-full object-cover" />
            <div className="space-y-1 p-4">
              <p className="text-sm font-bold text-black">Danh mục: {post.post_catalog_id.name}</p>
              <h2 className="truncate text-xl font-semibold text-gray-900">{post.title.charAt(0).toUpperCase() + post.title.slice(1)}</h2>
              <div className="line-clamp-3 text-gray-600" dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '') }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bài viết chi tiết */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black/60 p-2 xl:p-0"
          onClick={handleClosePostModal}
        >
          <div className="flex w-full flex-row items-end justify-between">
            <div className="break-words bg-black p-2 text-sm text-white xl:text-2xl">
              {selectedPost.title.charAt(0).toUpperCase() + selectedPost.title.slice(1)}
            </div>
            {/*  */}
            <button
              onClick={handleClosePostModal}
              className="bg-red-500 px-5 py-3 text-xl text-white hover:text-gray-800 xl:px-4 xl:py-2 xl:text-2xl"
            >
              <span className="hidden xl:block">ESC / Đóng</span>
              <span className="block xl:hidden">Đóng</span>
            </button>
          </div>
          <div
            className="h-full w-full cursor-default overflow-auto border-[8px] border-white bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          </div>
        </div>
      )}
    </div>
  );
}
