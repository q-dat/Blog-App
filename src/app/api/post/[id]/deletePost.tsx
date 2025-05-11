import Post from '@/app/models/Post';
import { connectDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const optionCosmetic = await Post.findByIdAndDelete(id).lean();
    if (!optionCosmetic) {
      return NextResponse.json({ success: false, error: 'Bài viết không tồn tại!' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Bài viết đã được xóa thành công!',
    });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ success: false, error: 'Lỗi khi xóa bài viết!' }, { status: 500 });
  }
}
