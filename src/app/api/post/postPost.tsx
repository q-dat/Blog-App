import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/app/models/Post';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const imageFile = formData.getAll('imageUrl') as Blob[];
    let imageUrl = '';

    // Upload ảnh nếu có
    if (imageFile.length > 0 && imageFile[0] instanceof Blob) {
      const file = imageFile[0];
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      const uploadRes = await cloudinary.uploader.upload(base64, {
        folder: 'posts/images',
        format: 'webp',
        transformation: [{ width: 800, crop: 'limit' }],
      });

      imageUrl = uploadRes.secure_url;
    }

    // Tạo bài viết mới
    const newPost = await Post.create({
      title: formData.get('title'),
      post_catalog_id: formData.get('post_catalog_id'),
      content: formData.get('content'),
      imageUrl,
    });

    return NextResponse.json(
      {
        message: 'Tạo bài viết thành công!',
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi khi tạo bài viết!',
      },
      { status: 500 }
    );
  }
}
