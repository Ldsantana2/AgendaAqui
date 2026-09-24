"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaRegClock } from "react-icons/fa";
import { getBlogPostsPublished } from "../../services/blogService";
import LoadingOverlay from "../LoadingOverlay";
import { BlogCards } from "../../pages/blog";

export default function BlogSection({ blogPosts }: { blogPosts: any[] }) {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const posts = await getBlogPostsPublished();
        const postsBlog = posts.data.slice(0, 3);
        setPosts(postsBlog);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  function formatDate(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      throw new Error("Data inválida");
    }

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("pt-BR", { month: "long" });
    const year = dateObj.getFullYear();

    return `${day}, ${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`;
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left">
          Blog de Saúde e Bem-estar
        </h2>

        <div className="sm:grid lg:grid-cols-3 flex overflow-x-auto sm:overflow-hidden scroll-smooth gap-4">
          {posts.map((post, index) => (
            <div key={index} className="w-full min-w-[100%]">
              <BlogCards blogPost={post} className="w-full sm:w-auto h-full sm:h-auto min-h-[10%] sm:min-h-max flex-shrink-0" />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#283277] hover:bg-[#1f265f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#283277]"
          >
            Ver todos os artigos
          </button>
        </div>
      </div>
    </div>
  );
}
