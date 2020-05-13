export const timeToDate = (timeStampe: number): any =>{
  if(timeStampe>0){
    const date = new Date(timeStampe).toLocaleDateString();
    return date;
  } else return '';
}
export const timeToDateyyymmdd = (timeStampe: number): any => {
  if(timeStampe>0){
    const date = new Date(timeStampe);
   let month = '' + (date.getMonth() + 1);
   let day = '' + date.getDate();
   const  year = date.getFullYear();

if (month.length < 2) 
    month = '0' + month;
if (day.length < 2) 
    day = '0' + day;

return [year, month, day].join('-');
  
  } else  return '';
}