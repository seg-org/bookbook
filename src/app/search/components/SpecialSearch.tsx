import React, { createContext, useContext, useState } from "react";

interface PostFilters {
  author?: string;
  genre?: string;
  publisher?: string;
  isbn?: string;
}

interface PostContextType {
  filters: PostFilters;
  setPostsFilters: React.Dispatch<React.SetStateAction<PostFilters>>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setPostsFilters] = useState<PostFilters>({});

  return (
    <PostContext.Provider value={{ filters, setPostsFilters }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = (): PostContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};