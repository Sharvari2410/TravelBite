export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

export const titleCase = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const includesQuery = (target, query) =>
  target.toLowerCase().includes(query.trim().toLowerCase());

export const byField = (list, field, query) => {
  if (!query.trim()) return list;
  return list.filter((item) => includesQuery(String(item[field] ?? ""), query));
};

export const wait = (ms = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });