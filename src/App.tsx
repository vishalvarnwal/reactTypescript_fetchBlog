import { type ReactNode, useEffect, useState } from "react";
import BlogPosts, { type BlogPost } from "./components/BlogPosts";
import { get } from "./utils/http";
import fetchingImg from "../src/assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

type RawDataBlogPost = {
  id: number;
  userId: number;
  body: string;
  title: string;
};

function App() {
  const [fetchedPost, setFetchedPost] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => {
    async function fetchPost() {
      setIsFetching(true);
      try {
        const data = (await get(
          "https://jsonplaceholder.typicode.com/posts"
        )) as RawDataBlogPost[];
        const blogPosts: BlogPost[] = data.map((rawPost) => ({
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body,
        }));
        setFetchedPost(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }

      setIsFetching(false);
    }
    fetchPost();
  }, []);

  let content: ReactNode;
  if (fetchedPost) {
    content = <BlogPosts posts={fetchedPost} />;
  }
  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>;
  }
  if (error) {
    content = <ErrorMessage text={error} />;
  }
  return (
    <main>
      <img
        src={fetchingImg}
        alt="An abstract image depicting a data fetching process."
      />
      {content}
    </main>
  );
}

export default App;
