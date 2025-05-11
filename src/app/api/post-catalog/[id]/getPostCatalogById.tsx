import PostCatalog from '@/app/models/PostCatalog';
import { connectDB } from '@/lib/mongodb';
import { IPostCatalog } from '@/types/type/post-catalog';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const paths = req.nextUrl.pathname.split('/');
    const id = paths[paths.length - 1];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'ID truyền vào không hợp lệ!' }, { status: 400 });
    }
    const postCatalog = (await PostCatalog.findById(id).lean()) as IPostCatalog | null;
    if (!postCatalog) {
      return NextResponse.json({ success: false, message: 'Danh mục không tìm thấy!' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: postCatalog,
    });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi lấy thông tin danh mục!' }, { status: 500 });
  }
}
