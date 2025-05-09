import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/app/models/Post";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID không hợp lệ!" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Bài viết không tồn tại!" },
        { status: 404 }
      );
    }

    const imageFile = formData.get("imageUrl") as Blob | null;

    // Nếu có ảnh mới -> upload lên Cloudinary
    const imageUrl = imageFile
      ? (await uploadToCloudinary(imageFile, "posts/images")).secure_url
      : post.imageUrl;

    // Cập nhật dữ liệu
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: formData.get("title") || post.title,
        post_catalog_id:
          formData.get("post_catalog_id") || post.post_catalog_id,
        content: formData.get("content") || post.content,
        imageUrl,
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      message: "Cập nhật bài viết thành công!",
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json(
      {
        message: "Lỗi khi cập nhật bài viết!",
        success: false,
      },
      { status: 500 }
    );
  }
}
