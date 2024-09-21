export const translateGender = (gender: string) => {
    switch (gender) {
      case "male":
        return "ذكر";
      case "female":
        return "أنثى";
      default:
        return gender; // Return as is if no match found
    }
  };