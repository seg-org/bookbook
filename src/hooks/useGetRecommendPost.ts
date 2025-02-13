import { Post } from "@/data/dto/post.dto";
import { getRecommendPosts } from "@/data/recommend-post";
import { useEffect, useState } from "react";

export const useGetRecommendPost = (userId: string) => {
  const [recommend_post_loading, setRecommend_post_loading] = useState(true);
  const [recommend_post_error, setRecommend_post_error] = useState<Error | null>(null);
  const [recommend_post, setRecommend_post] = useState<Post>();

  useEffect(() => {
    (async () => {
      const res = await getRecommendPosts(userId);
      if (res instanceof Error) {
        return setRecommend_post_error(res);
      }

      setRecommend_post(res);
      setRecommend_post_loading(false);
    })();
  }, []);

  return { recommend_post, recommend_post_loading, recommend_post_error };
};
