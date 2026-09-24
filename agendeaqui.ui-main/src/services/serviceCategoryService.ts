import {ServiceCategory} from "../entities/serviceCategory";

const base_url_api = process.env.NEXT_PUBLIC_BASE_ROUTE;

const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  try {
    const response = await fetch(`${base_url_api}/service_category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);
    if (!response.ok) {
      throw new Error("Falha ao carregar os dados da clinica");
    }

    const payload = await response.json();
    return payload.data as ServiceCategory[];
  } catch (error) {
    console.error(
      "Erro ao carregar os dados da clinica:",
      (error as Error).message,
    );
    throw error;
  }
};

export { getServiceCategories };
