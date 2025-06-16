import axios from "axios";

const apiClient = axios.create({
    baseURL: "",
    timeout: 5000,
});

export const getProducts = async () => {
    try {
        const response = await apiClient.get("/products");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        throw error;
    }
};