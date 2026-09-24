import axios from "axios";
import { BlogPost } from "../entities/Blog";

const API_URL = "https://agendeaqui-api-auth.onrender.com/api"; // ✅ API deployada

export const getBlogPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/blog`)
        return response.data

    } catch (error) {
        console.error(
            "Erro ao carregar os dados do blog:",
            (error as Error).message
        )
        throw error
    }
}

export const getBlogPostsPublished = async () => {
    try {
        const response = await axios.get(`${API_URL}/blog/published`)
        return response.data

    } catch (error) {
        console.error(
            "Erro ao carregar os dados do blog:",
            (error as Error).message
        )
        throw error
    }
}

export const getBlogPostForId = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/blog/${id}`)
        return response.data

    } catch (error) {
        console.error(
            "Erro ao carregar os dados do blog:",
            (error as Error).message
        )
        throw error
    }
}

