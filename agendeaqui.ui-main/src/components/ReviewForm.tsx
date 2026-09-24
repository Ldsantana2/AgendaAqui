import { useEffect, useState } from "react";
import { useMessage } from "../context/MessageContext";
import {
  addReview,
  getReviewsByAppointmentId,
} from "../services/reviewService";
import { Rate } from "antd";
import { styleText } from "util";
import { Review } from "../entities/Review";

const ReviewForm = ({
  patientId,
  clinicId,
  appointmentId,
  review,
  onReviewSuccess,
}: {
  patientId: string;
  clinicId: string;
  appointmentId: string;
  review: { id: string; comment?: string; rating?: number };
  onReviewSuccess?: () => void;
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const messageApi = useMessage();

  const maxChars = 200;

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      setComment(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const reviewData = {
        rating: rating,
        comment: comment,
      };

      await addReview(appointmentId, reviewData);

      messageApi.success("Avaliação enviada com sucesso!");

      setRating(5);
      setComment("");

      const newReviews = await getReviewsByAppointmentId(appointmentId);
      if (onReviewSuccess) {
        onReviewSuccess();
      }
    } catch (error: any) {
      messageApi.error(`Erro ao enviar avaliação: ${error.message}`);
    }
  };

  return (
    <>
      {review && (
        <>
          <div className="flex flex-col">
            <p className="text-xs font-semibold mb-4">Sua avaliação</p>
            <div className="flex">
              <Rate value={review.rating} />
              <p className="text-sm font-extralight text-[#62636C] ml-2 items-center">
                {review.rating} estrelas
              </p>
            </div>
          </div>
          <div className="mb-4 bg-[#F7F7F7] rounded-lg shadow-sm">
            {review.comment && (
              <p className=" py-3 pl-4 mt-2 text-sm font-extralight text-[#101112]">
                {review.comment}
              </p>
            )}
          </div>
        </>
      )}
      {!review.id && (
        <>
          <p className="text-xs font-semibold mb-4">Avalie sua experiência</p>
          <div>
            <Rate value={rating} onChange={(value) => setRating(value)} />
          </div>

          <div className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <textarea
                value={comment}
                onChange={handleCommentChange}
                className="w-full max-w-screen-2xl h-32 border border-gray-300 rounded px-5 py-3 text-sm resize-none focus:outline-none focus:border-[#2D39A6]"
                placeholder="Comentário opcional (até 200 caracteres)"
              />
              <div className="mt-2 text-left text-sm text-gray-500">
                {comment.length}/{maxChars} caracteres
              </div>

              <div className="flex justify-end mt-2 mb-6">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#4E80EE] text-white rounded-lg hover:bg-[#2D39A6] transition"
                >
                  Enviar Avaliação
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default ReviewForm;
