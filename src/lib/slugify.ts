/**
 * Generates a URL-friendly slug from vehicle data
 * Example: "Honda HR-V 2021 EXL" -> "honda-hrv-2021-exl"
 */
export function generateVehicleSlug(
  brand: string,
  model: string,
  yearModel: number,
  version?: string | null
): string {
  const parts = [brand, model, yearModel.toString()];
  
  if (version) {
    parts.push(version);
  }

  return parts
    .join("-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Creates a full slug with ID for unique identification
 * Example: "honda-hrv-2021-exl-abc123"
 */
export function generateVehicleSlugWithId(
  id: string,
  brand: string,
  model: string,
  yearModel: number,
  version?: string | null
): string {
  const slug = generateVehicleSlug(brand, model, yearModel, version);
  const shortId = id.slice(0, 8);
  return `${slug}-${shortId}`;
}

/**
 * Extracts the vehicle ID from a slug
 * Example: "honda-hrv-2021-exl-abc123" -> "abc123"
 */
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1] || slug;
}

/**
 * Formats title for display from vehicle data
 */
export function formatVehicleTitle(
  brand: string,
  model: string,
  version?: string | null
): string {
  const parts = [brand, model];
  if (version) {
    parts.push(version);
  }
  return parts.join(" ");
}
