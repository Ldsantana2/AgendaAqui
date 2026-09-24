import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getBlogPostForId } from "../../services/blogService";
import { BlogPost } from "../../entities/Blog";
import LoadingOverlay from "../../components/LoadingOverlay";
import Image from "next/image";

export default function BlogPage() {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [safeContent, setSafeContent] = useState("");
  const [post, setPost] = useState<BlogPost | null>(null);

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

  useEffect(() => {
    if (!router.isReady) return; // espera o router estar pronto
    if (typeof id !== "string") return; // ainda pode estar indefinido ou array

    setIsLoading(true);

    const fetchPost = async () => {
      try {
        const postDetail = await getBlogPostForId(id);
        setPost(postDetail.data);
        setSafeContent(postDetail.data.content);
        console.log("Post carregado:", postDetail.data);
      } catch (error) {
        console.error("Erro ao buscar o post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [router.isReady, id]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container mx-auto p-6">
      <section className="flex justify-center items-center flex-col">
        <h1 className="text-2xl font-medium text-[#2D39A6] mb-4 max-w-lg h-auto text-center pb-4 pt-7">
          {post.title}
        </h1>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {post.tags?.map((tag, index) =>
            tag ? (
              <span
                key={index}
                className="bg-blue-100 text-[#283277] text-sm font-medium px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ) : null,
          )}
        </div>
        <p className="text-base font-normal text-gray-600 h-auto max-w-2xl text-center">
          {post.summary}
        </p>
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[40rem]">
          <Image
            src="/images/pexels-pixabay-40568.jpg"
            alt="blog"
            fill
            className="object-cover object-center rounded-md"
          />
        </div>
      </section>
      <section className="flex flex-col gap-1 py-6 px-4 border-l-4 border-[#283277] bg-[#283277] rounded-md shadow-sm mb-8  mx-auto">
        <h3 className="text-lg font-semibold text-blue-100">
          Detalhes da publicação
        </h3>
        <p className="text-gray-600">
          Feito por: <span className="font-medium">Agendaqui Saúde</span>
        </p>
        <p className="text-gray-600">{formatDate(post.createdAt)}</p>
      </section>
      <section
        className="prose prose-lg lg:prose-xl  text-justify text-gray-600 p-6 md:p-9"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
      <hr />
    </div>
  );
}
