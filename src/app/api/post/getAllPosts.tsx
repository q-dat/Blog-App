import Post from '@/app/models/Post';
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().lean();
    return NextResponse.json({
      message: 'Lấy danh sách bài viết thành công!',
      data: posts,
    });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ success: false, error: 'Lỗi khi lấy danh sách bài viết!' }, { status: 500 });
  }
}
