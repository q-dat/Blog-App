import PostCatalog from "@/app/models/PostCatalog";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const newWallet = new PostCatalog(body);
    await newWallet.save();
    return NextResponse.json({
      message: "Tạo danh mục thành công!",
      success: true,
      data: newWallet,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Lỗi:", error.message);
    } else {
      console.error("Lỗi không xác định:", error);
    }
  }
}
