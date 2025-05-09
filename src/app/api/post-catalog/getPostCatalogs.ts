import PostCatalog from "@/app/models/PostCatalog";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const wallets = await PostCatalog.find();
    return NextResponse.json({
      message: "Lấy thành công danh sách danh mục!",
      success: true,
      data: wallets,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Lỗi:", error.message);
    } else {
      console.error("Lỗi không xác định:", error);
    }
  }
}
