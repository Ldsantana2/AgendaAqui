"use client";

import { useRouter } from "next/router";
import { BlogPost } from "../entities/Blog";
import { useEffect, useState } from "react";
import { getBlogPostsPublished } from "../services/blogService";
import LoadingOverlay from "../components/LoadingOverlay";
import { Card } from "antd";

interface BlogCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  blogPost: BlogPost;
}

export const BlogCards: React.FC<BlogCardsProps> = ({
  blogPost,
  className,
  ...props
}) => {
  const [summary, setSummary] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam modi, expedita quos doloremque autem ipsum itaque incidunt ipsam reprehenderit fuga! Dolores quisquam eius cum accusamus?",
  );
  const router = useRouter();

  function formatDate(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      throw new Error("Data inválida");
    }

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("pt-BR", { month: "long" });
    const year = dateObj.getFullYear();

    return `${day} de ${month.charAt(0).toLowerCase() + month.slice(1)} de ${year}`;
  }

  useEffect(() => {
    if (summary.length > 100) {
      setSummary(`${blogPost.summary.slice(0, 99)}...`);
    } else {
      setSummary(blogPost.summary);
    }
  }, [blogPost.summary]);

  const handleClick = () => {
    router.push(`/blog/${blogPost.id}`);
  };

  return (
    <div className={className} {...props}>
      <Card
        {...props}
        className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden"
        cover={
          <div
            className="h-48 bg-gray-300 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/clinic-card-image.jpg")',
            }}
          />
        }
      >
        <div className="rounded-md">
          <h2 className="text-xs font-normal mb-1 text-[#6C727F]">
            {formatDate(blogPost.createdAt)}
          </h2>

          <h1 className="text-xl font-semibold mb-3">{blogPost.title}</h1>

          <p className="leading-relaxed mb-2 text-sm text-[#6C727F]">
            {summary}
          </p>

          <div
            className="flex items-center flex-wrap ml-1 cursor-pointer"
            onClick={handleClick}
          >
            <span className="text-[#283277] inline-flex items-center text-xs font-medium hover:text-[#1f264e] transition-colors duration-200">
              Ler mais
              <svg
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function Blog() {
  const postsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  function getPageNumbers(
    currentPage: number,
    totalPages: number,
  ): (number | string)[] {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let last: number;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (last) {
        if (i - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (i - last !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  }

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const posts = await getBlogPostsPublished();
        setPosts(posts.data);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#283277] mb-4">Blog</h1>

      <div className="flex flex-wrap">
        {currentPosts.map((post) => (
          <BlogCards
            key={post.id}
            blogPost={post}
            className="p-4 sm:w-1/2 lg:w-2/6 w-full"
          />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center items-center mt-6 space-x-2 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border rounded text-[#283277] border-[#283277] disabled:opacity-50"
        >
          Anterior
        </button>

        {getPageNumbers(currentPage, totalPages).map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm border rounded ${
                currentPage === page
                  ? "bg-[#283277] text-white"
                  : "bg-white text-[#283277] border-[#283277]"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-3 py-2 text-gray-400 text-sm">
              ...
            </span>
          ),
        )}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border rounded text-[#283277] border-[#283277] disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
