export const getUrgency = (sentiment, category) => {
  const s = sentiment?.toLowerCase();
  const c = category?.toLowerCase();

  if (c === "pertanyaan" && (s === "negatif" || s === "netral")) return "Tinggi";
  if (c === "pertanyaan" && s === "positif") return "Sedang";
  if (c === "pernyataan" && s === "negatif") return "Sedang";
  return "Rendah";
};