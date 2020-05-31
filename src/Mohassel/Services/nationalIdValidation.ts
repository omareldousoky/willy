function getCentury(birthCentury: string): string {
    switch (birthCentury) {
        case '2':
            return '19';
        case '3':
            return '20';
        case '4':
            return '21';
        case '5':
            return '22';
        default:
            return '';
    }
}
function isValidDate(year: number, month: number, day: number) {
    month = month - 1;
    const d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
        return true;
    }
    return false;
}
export const getBirthdateFromNationalId = (nationalIdNumber: string): string => {
    const nationalIdNumberTrimmed = nationalIdNumber.substring(0, 7);
    const firstDigitsYear = getCentury(nationalIdNumberTrimmed[0]);
    const year = firstDigitsYear + nationalIdNumberTrimmed.substring(1, 3);
    const month = nationalIdNumberTrimmed.substring(3, 5);
    const day = nationalIdNumberTrimmed.substring(5, 7);
    const birthDate = `${year}-${month}-${day}`;
    const dateValid = isValidDate(Number(year), Number(month), Number(day));
    if (isNaN(new Date(birthDate).valueOf()) || firstDigitsYear === '' || !dateValid) {
        return '1800-01-01';
    }
    return birthDate;
}
export const getGenderFromNationalId = (nationalIdNumber: string): string => {
    const genderNumber = nationalIdNumber[12];
    if (Number(genderNumber) % 2 === 0) return 'female'
    else return 'male'
}