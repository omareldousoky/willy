export const nationalIdValidation = (nationalIdNumber: string, birthDate: string, country: string, gender: string): boolean => {
    const birthDateTrimmed = birthDate.split('-').join('').substring(2);
    const nationalIdNumberTrimmed = nationalIdNumber.substring(1,7);
    const genderNumber = nationalIdNumber[13];
    return birthDateTrimmed === nationalIdNumberTrimmed;
}