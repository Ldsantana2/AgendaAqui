import axios from "axios";
import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

export const searchForIndexPage = async () => {
    try {
        const response = await axios.get(`${API_URL}/clinic/list-search`, {
            headers: {
                "Content-Type": "application/json",
            }
        })

        return response?.data?.data
    } catch (error) {
        console.error("Erro ao buscar os itens da pagina inicial")
    }
}