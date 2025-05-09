import PostCatalog from "@/app/models/PostCatalog";
import { connectDB } from "@/lib/mongodb";
import { IPostCatalog } from "@/types/type/post-catalog";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const paths = req.nextUrl.pathname.split("/");
    const id = paths[paths.length - 1];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID truyền vào không hợp lệ!" },
        { status: 400 }
      );
    }

    const postCatalog = await PostCatalog.findById(id);
    if (!postCatalog) {
      return NextResponse.json(
        { success: false, message: "Danh mục không tìm thấy!" },
        { status: 404 }
      );
    }

    const body = (await req.json()) as Partial<IPostCatalog>;
    const updatedPostCatalog = (await PostCatalog.findByIdAndUpdate(
      id,
      { name: body.name || postCatalog.name },
      { new: true, runValidators: true }
    ).lean()) as IPostCatalog | null;

    return NextResponse.json({
      success: true,
      message: "Cập nhật danh mục danh mục thành công",
      data: updatedPostCatalog,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật danh mục danh mục!" },
      { status: 500 }
    );
  }
}
