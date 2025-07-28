import { getAllPosts } from '@/services/postService';
import ClientHomePage from './ClientHomePage';

export default async function Home() {
  const initialPosts = await getAllPosts();

  return <ClientHomePage initialPosts={initialPosts} />;
}
