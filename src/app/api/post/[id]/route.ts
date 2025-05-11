import { NextRequest } from 'next/server';
import { GET as handleGetById } from './getPostById';
import { PUT as handleUpdate } from './updatePost';
import { DELETE as handleDelete } from './deletePost';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return handleGetById(_req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return handleUpdate(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return handleDelete(req, context);
}
