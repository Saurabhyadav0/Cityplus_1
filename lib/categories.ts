export function categorizeComplaint(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()

  if (text.includes("garbage") || text.includes("trash") || text.includes("waste")) {
    return "Garbage"
  }
  if (text.includes("road") || text.includes("pothole") || text.includes("street")) {
    return "Pothole"
  }
  if (text.includes("light") || text.includes("lamp") || text.includes("lighting")) {
    return "Lighting"
  }
  if (text.includes("water") || text.includes("leak") || text.includes("pipe")) {
    return "Water"
  }

  return "Other"
}
