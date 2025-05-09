import { NextRequest } from 'next/server';
import { GET as handleGet } from './getPostCatalogById';
import { PUT as handlePut } from './putPostCatalog';
import { DELETE as handleDelete } from './deletePostCatalog';

export async function GET(req: NextRequest) {
  return handleGet(req);
}

export async function PUT(req: NextRequest) {
  return handlePut(req);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req);
}
