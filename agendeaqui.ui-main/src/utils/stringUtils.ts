/**
 * Capitaliza a primeira letra de cada palavra em uma string,
 * convertendo o restante da palavra para minúsculas.
 * Ideal para formatar nomes próprios, endereços, etc., que podem vir em maiúsculas.
 * Ex: "RUA PRINCIPAL" -> "Rua Principal"
 * Ex: "AV. DAS FLORES" -> "Av. Das Flores"
 *
 * @param str
 * @returns
 */
export const capitalizeWords = (str: string): string => {
  // Simplifica a verificação de str nula, indefinida ou vazia
  if (!str) {
    return "";
  }
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      // Lida com múltiplos espaços, para não tentar capitalizar uma string vazia
      if (word.length === 0) {
        return "";
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};
