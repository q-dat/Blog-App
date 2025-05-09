import { NextRequest } from "next/server";
import { GET as handleGet } from "./getPostCatalogs";
import { POST as handlePost } from "./postPostCatalog";

export async function GET() {
  return handleGet();
}

export async function POST(req: NextRequest) {
  return handlePost(req);
}
