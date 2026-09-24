import { getToken } from "./authService";
const base_url_api = process.env.NEXT_PUBLIC_BASE_ROUTE;

const getReviewsByClinicId = async (clinicId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${base_url_api}/reviews/clinic/${clinicId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar reviews da clínica.");
    }

    const payload = await response.json();
    return payload.data ?? [];
  } catch (error) {
    console.error(
      "Erro ao buscar reviews da clínica:",
      (error as Error).message,
    );
    return [];
  }
};

const addReview = async (
  appointmentId: string,
  reviewData: {
    rating: number;
    comment?: string;
  },
): Promise<any> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Você precisa estar logado para enviar uma avaliação.");
    }
    const response = await fetch(
      `${base_url_api}/appointment/${appointmentId}/review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message ||
        errorData.error ||
        `Erro do servidor: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar avaliação:", (error as Error).message);
    throw error;
  }
};

const getReviewsByAppointmentId = async (appointmentId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${base_url_api}/reviews/appointment/${appointmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar reviews do médico.");
    }

    const payload = await response.json();
    return payload.data ?? [];
  } catch (error) {
    console.error("Erro ao buscar reviews:", (error as Error).message);
    return [];
  }
};

export { getReviewsByClinicId, addReview, getReviewsByAppointmentId };
