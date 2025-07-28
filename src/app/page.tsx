import { getAllPosts } from '@/services/postService';
import ClientHomePage from './ClientHomePage';

export default async function Home() {
  const initialPosts = await getAllPosts();

  return (
    <div className="container mx-auto p-6">
      <ClientHomePage initialPosts={initialPosts} />
    </div>
  );
}
