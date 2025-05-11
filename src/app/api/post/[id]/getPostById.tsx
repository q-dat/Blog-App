import Post from '@/app/models/Post';
import { connectDB } from '@/lib/mongodb';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const optionCosmetic = await Post.findById(id).lean();
    if (!optionCosmetic) {
      return NextResponse.json({ success: false, error: 'Bài viết không tồn tại!' }, { status: 404 });
    }
    // Xóa cache sau khi tạo bài viết thành công
    revalidateTag('posts');
    return NextResponse.json({ success: true, data: optionCosmetic });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ success: false, error: 'Lỗi khi lấy bài viết này!' }, { status: 500 });
  }
}
