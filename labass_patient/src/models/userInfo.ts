// UserInfo.ts

class UserInfo {
    firstName: string;
    lastName: string;
    nationalId: string;
    dateOfBirth: string;
    gender: string;
  
    constructor(
      firstName: string = "", 
      lastName: string = "", 
      nationalId: string = "", 
      dateOfBirth: string = "", 
      gender: string = ""
    ) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.nationalId = nationalId;
      this.dateOfBirth = dateOfBirth;
      this.gender = gender;
    }
  
    // Method to validate the user info
    validate(): string | null {
      if (!this.firstName.trim()) return "First name is required.";
      if (!this.lastName.trim()) return "Last name is required.";
      if (!this.nationalId.trim()) return "National ID is required.";
      if (!this.dateOfBirth) return "Date of birth is required.";
      if (!this.gender) return "Gender selection is required.";
      return null;  // No validation errors
    }
  }
  
  export default UserInfo;
  