import PostCatalog from "@/app/models/PostCatalog";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
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

    const deletedPostCatalog = await PostCatalog.findByIdAndDelete(id);
    if (!deletedPostCatalog) {
      return NextResponse.json(
        { success: false, message: "Danh mục không tìm thấy!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa danh mục sản phẩm thành công.",
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa danh mục!" },
      { status: 500 }
    );
  }
}
