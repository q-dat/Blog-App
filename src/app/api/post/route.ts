import { NextRequest } from 'next/server';
import { GET as handleGetAll } from './getAllPosts';
import { POST as handlePost } from './postPost';

export async function GET() {
  return handleGetAll();
}

export async function POST(req: NextRequest) {
  return handlePost(req);
}
