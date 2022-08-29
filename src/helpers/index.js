export const baseUrl = (pathname) => process.env.PUBLIC_URL + pathname;

export const typeColor = (type) => {
  switch (type) {
    case "normal":
      return {
        bg: "#ffcb05",
        color: "#fff",
        border: "#ffcb05",
      }
    case "fighting":
      return {
        bg: "#D61C4E",
        color: "#fff",
        border: "#D61C4E",
      }
    case "flying":
      return {
        bg: "#C1EFFF",
        color: "#000",
        border: "#C1EFFF",
      }
    case "poison":
      return {
        bg: "#3FA796",
        color: "#fff",
        border: "#3FA796",
      }
    case "ground":
      return {
        bg: "#D1512D",
        color: "#fff",
        border: "#D1512D",
      }
    case "rock":
      return {
        bg: "#F1F1F1",
        color: "#000",
        border: "#F1F1F1",
      }
    case "bug":
      return {
        bg: "#EB4747",
        color: "#fff",
        border: "#EB4747",
      }
    case "ghost":
      return {
        bg: "#FAF3E3",
        color: "#000",
        border: "#FAF3E3",
      }
    case "fire":
      return {
        bg: "#F94C66",
        color: "#fff",
        border: "#F94C66",
      }
    case "water":
      return {
        bg: "#3AB4F2",
        color: "#000",
        border: "#3AB4F2",
      }
    case "grass":
      return {
        bg: "#FFC18E",
        color: "#000",
        border: "#FFC18E",
      }
    case "electric":
      return {
        bg: "#FFF80A",
        color: "#000",
        border: "#FFF80A",
      }
    case "psychic":
      return {
        bg: "#C8B6E2",
        color: "#000",
        border: "#C8B6E2",
      }
    case "noicermal":
      return {
        bg: "#898AA6",
        color: "#000",
        border: "#898AA6",
      }
    case "dragon":
      return {
        bg: "#76549A",
        color: "#fff",
        border: "#76549A",
      }
    case "dark":
      return {
        bg: "#100F0F",
        color: "#fff",
        border: "#100F0F",
      }
    case "fairy":
      return {
        bg: "#FFE898",
        color: "#000",
        border: "#FFE898",
      }
    case "unknown":
      return {
        bg: "#fff",
        color: "#000",
        border: "#000",
      }
    case "shadow":
      return {
        bg: "#F7ECDE",
        color: "#000",
        border: "#F7ECDE",
      }
    default:
      return "#000";
  }
}
