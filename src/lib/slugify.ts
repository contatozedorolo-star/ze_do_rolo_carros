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
 * Creates a full slug with complete ID for unique identification
 * Example: "honda-hrv-2021-exl-44cf97bb-5b10-4b14-a60b-41219e24936a"
 */
export function generateVehicleSlugWithId(
  id: string,
  brand: string,
  model: string,
  yearModel: number,
  version?: string | null
): string {
  const slug = generateVehicleSlug(brand, model, yearModel, version);
  return `${slug}-${id}`;
}

/**
 * Extracts the vehicle ID from a slug
 * Supports both full UUID and partial ID formats
 * Example: "honda-hrv-2021-exl-44cf97bb-5b10-4b14-a60b-41219e24936a" -> "44cf97bb-5b10-4b14-a60b-41219e24936a"
 */
export function extractIdFromSlug(slug: string): string {
  // Try to extract full UUID (36 chars with format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
  const uuidMatch = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  if (uuidMatch) {
    return uuidMatch[1];
  }
  
  // Fallback: get last part after last dash (for legacy short IDs)
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
