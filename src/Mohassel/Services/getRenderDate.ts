export const getRenderDate = (date: number) => {
    const today = new Date(date);
    let dd: string|number = today.getDate();
    let mm: string|number = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    return(dd+'-'+mm+'-'+yyyy)
}

export const getDateAndTime = (date: number) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
       };
    const dateString = new Date(date).toLocaleTimeString('ar-EG', options);
    return dateString
}