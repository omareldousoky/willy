export const timeToDate = (timeStape: number): string =>{
  if(timeStape>0){
    const date = new Date(timeStape).toLocaleDateString();
    return date;
  } else return '';
}