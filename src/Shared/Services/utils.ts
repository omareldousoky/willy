import * as local from '../../Shared/Assets/ar.json';
import jwtDecode from 'jwt-decode';
import JsZip from 'jszip';
import {saveAs} from 'file-saver'
import Swal from 'sweetalert2';
import{default as errorMessages}  from '../../Shared/Assets/errorMessages.json'
export const timeToDate = (timeStampe: number): any => {
  if (timeStampe > 0) {
    const date = new Date(timeStampe).toLocaleDateString();
    return date;
  } else return '';
}
export const timeToDateyyymmdd = (timeStamp: number): any => {
  if (timeStamp === -1) {
    return new Date().toISOString().slice(0, 10)
  } else if (timeStamp !== undefined && !isNaN(timeStamp))
    return new Date(timeStamp).toISOString().slice(0, 10)
}

export function parseJwt(token: string) {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};
export function documentTypeLocalization(val: string) {
  switch (val) {
    case 'customer':
      return local.customer
    case 'loanApplication':
      return local.loanApplicationId
    case 'issuedLoan':
      return local.issuedLoan
    default:
      return ''
  }
}
export function beneficiaryType(val: string) {
  switch (val) {
    case 'individual':
      return local.individual
    case 'group':
      return local.group
    default:
      return ''
  }
}
export function getErrorMessage (key: string) {
  if(key && errorMessages[key] )
  return errorMessages[key].ar;
  else {
    return errorMessages['default_error'].ar;
  }
}
export function currency(val: string) {
  switch (val) {
    case 'egp':
      return local.egp
    default:
      return ''
  }
}
export function loanNature(val: string) {
  switch (val) {
    case 'cash':
      return local.cash
    default:
      return ''
  }
}
export function interestPeriod(val: string) {
  switch (val) {
    case 'yearly':
      return 'نسبه سنويه'
    case 'monthly':
      return 'نسبه شهريه'
    default:
      return ''
  }
}
export function interestType(val: string) {
  switch (val) {
    case 'flat':
      return local.interestTypeFlat
    case 'reducing':
      return local.interestTypeReducing
    default:
      return ''
  }
}
export function periodType(val: string) {
  switch (val) {
    case 'months':
      return 'اشهر'
    case 'days':
      return 'يوم'
    default:
      return ''
  }
}
export function inAdvanceFrom(val: string) {
  switch (val) {
    case 'principal':
      return local.inAdvanceFromPrinciple
    case 'monthly':
      return local.inAdvanceFromMonthly
    case 'yearly':
      return local.inAdvanceFromYearly
    default:
      return ''
  }
}
export function inAdvanceType(val: string) {
  switch (val) {
    case 'cut':
      return local.inAdvanceFeesCut
    case 'uncut':
      return local.inAdvanceFeesUncut
    default:
      return ''
  }
}
export function installmentType(val: string) {
  switch (val) {
    case 'principalAndFees':
      return local.installmentTypePrincipalAndFees
    case 'feesFirst':
      return local.installmentTypeFeesFirst
    default:
      return ''
  }
}
export function roundDirection(val: string) {
  switch (val) {
    case 'up':
      return local.roundUp
    case 'down':
      return local.roundDown
    default:
      return ''
  }
}
export function roundWhat(val: string) {
  switch (val) {
    case 'principal':
      return local.roundPrincipal
    case 'fees':
      return local.roundFees
    case 'principalAndFees':
      return local.roundPrincipalAndFees
    case 'installmentAndPrincipal':
      return local.roundInstallmentAndPrincipal
    case 'installmentAndFees':
      return local.roundInstallmentAndFees
    case 'installment':
      return local.roundInstallment
    case 'principalAndTotalFees':
      return local.roundPrincipalAndTotalFees
    default:
      return ''
  }
}
export function ageCalculate(val) {
  const dateNow = new Date();
  const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;
  const years = Math.floor((dateNow.getTime() - val) / MS_PER_YEAR);
  return years
}

export function checkIssueDate(issueDate) {
  const date = new Date(issueDate).valueOf();
  const endOfDay: Date = new Date();
  endOfDay.setHours(23, 59, 59, 59);
  const diffTime = Math.abs(endOfDay.valueOf() - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //2555 = 7 years
  if (diffDays > 2555) {
    return local.expired;
  } else return '';
}


export const combinePaths = (parent, child) =>
  `${parent.replace(/\/$/, "")}/${child.replace(/^\//, "")}`;

export const buildPaths = (routes, parentPath = "") =>
  routes.map(route => {
    const path = combinePaths(parentPath, route.path);

    return {
      ...route,
      path,
      ...(route.routes && { routes: buildPaths(route.routes, path) })
    };
  });


export const setupParents = (routes, parentRoute = {}) =>
  routes.map(route => {
    const withParent = {
      ...route,
      ...(parentRoute && { parent: parentRoute })
    };

    return {
      ...withParent,
      ...(withParent.routes && {
        routes: setupParents(withParent.routes, withParent)
      })
    };
  });


export const flattenRoutes = routes =>
  routes
    .map(route => [route.routes ? flattenRoutes(route.routes) : [], route])
    .flat(Infinity);


export const generateAppRoutes = routes => {
  return flattenRoutes(setupParents(buildPaths(routes)));
};


export const pathTo = route => {
  if (!route.parent) {
    return [route];
  }

  return [...pathTo(route.parent), route];
};

export const numbersToArabic = (input: number | string) => {
  if (input || input === 0) {
    const id = ['۰', '۱', '۲', '۳', '٤', '۵', '٦', '۷', '۸', '۹'];
    const inputStr = input.toString();
    return inputStr.replace(/[0-9]/g, (number) => {
      return id[number]
    });
  } else return '۰';
}
export const timeToArabicDateNow = (fullDate: boolean): string => {
  return fullDate ? new Date().toLocaleString('ar-EG') : new Date().toLocaleDateString('ar-EG')
}
export const timeToArabicDate = (timeStamp: number, fullDate: boolean): string => {
    return fullDate ? new Date(timeStamp).toLocaleString('ar-EG') : new Date(timeStamp).toLocaleDateString('ar-EG')
}
export const dayToArabic = (index: number): string => {
  const weekday = [local.sunday, local.monday, local.tuesday, local.wednesday, local.thursday, local.friday, local.saturday];
  return weekday[index];
}
export const customFilterOption = (option, rawInput) => {
  if (option.label) {
    const words = rawInput.split(' ');
    return words.reduce(
      (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
      true,
    );
  }
};
export function arabicGender(gender: string) {
  switch (gender) {
    case 'male': return local.male;
    case 'female': return local.female;
    default: return ''
  }
}


export const download = (url, fileName: string): void => {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  a.remove();
}

export const getStatus = (installment) => {
  const todaysDate = new Date().setHours(0, 0, 0, 0).valueOf();
  switch (installment.status) {
      case 'unpaid':
          if (new Date (installment.dateOfPayment).setHours(23, 59, 59, 59) < todaysDate)
              return local.late
          else
              return local.unpaid
      case 'pending': return local.pending;
      case 'paid': return local.paid;
      case 'partiallyPaid': return local.partiallyPaid;
      case 'rescheduled': return `${local.rescheduled}${installment.earlyPaymentReschedule ? (' - ' + local.earlyPayment) : ''}`;
      case 'cancelled': return local.cancelled;
      case 'canceled': return local.cancelled;
      case 'issued': return local.issued;
      default: return '';
  }
}
export const getInstallmentStatus = (status: string) => {
  switch (status) {
      case 'unpaid': return local.unpaid;
      case 'pending': return local.pending;
      case 'paid': return local.paid;
      case 'partiallyPaid': return local.partiallyPaid;
      case 'rescheduled': return local.rescheduled;
      case 'cancelled': return local.cancelled;
      case 'issued': return local.issued;
      default: return '';
  }
}
export const getIscoreReportStatus = (status: string) => {
  switch (status) {
      case 'queued': return local.queued;
      case 'processing': return local.processing;
      case 'created': return local.created;
      case 'failed': return local.failed;
      default: return '';
  }
}
export const getLoanStatus = (status: string) => {
  switch (status) {
      case 'pending': return local.pending;
      case 'paid': return local.paid;
      case 'partiallyPaid': return local.partiallyPaid;
      case 'rescheduled': return local.rescheduled;
      case 'cancelled': return local.cancelled;
      case 'canceled': return local.cancelled;
      case 'issued': return local.issued;
      case 'created': return local.created;
      case 'underReview': return local.underReview;
      case 'reviewed': return local.reviewed;
      case 'secondReview': return local.secondReviewed;
      case 'thirdReview': return local.thirdReviewed;
      case 'approved': return local.approved;
      case 'writtenOff': return local.writtenOffLoan;
      case 'Doubtful': return local.doubtedLoan;
      case 'doubt_cancelled': return local.cancelled;
      default: return '';
  }
}


export const getTimestamp = (datetimeString: string) => {
  const dateTime = datetimeString.split(" ");
  const datum = new Date(dateTime[0]).valueOf();
  return datum
}
export const iscoreDate = (date: any) => {
  const iscoreDate = new Date(date);
  const iscoreDateString = ('0' + iscoreDate.getDate()).slice(-2) + '/'
    + ('0' + (iscoreDate.getMonth() + 1)).slice(-2) + '/'
    + iscoreDate.getFullYear();
  return iscoreDateString
}

export const getDateString = (date: any) => {
  return (
    new Date(new Date(date).getTime() - (new Date(date).getTimezoneOffset() * 60000)).toISOString().split("T")[0]
  )
}

export const downloadFile = (fileURL) => {
  const link = document.createElement('a');
  link.href = fileURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export const getAge = (DOB) => {
  const today = new Date();
  const birthDate = new Date(DOB);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
  }

  return age;
}

export const getRandomPaymentByKey = (key)=>{
  if(key==='collectionCommission') return local.collectionCommission
  else if(key==="reissuingFees") return local.reissuingFees
  else if(key==="legalFees") return local.legalFees
  else if(key==="clearanceFees") return local.clearanceFees
  else if(key==='toktokStamp') return local.toktokStamp
  else if(key==='tricycleStamp') return local.tricycleStamp
  else if(key==='penalty') return local.payPenalty
}
export const getDataURL = async(url) => {

  const blob = await fetch(url).then(r => r.blob());
          const dataUrl: any = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          return  await dataUrl.replace("data:application/octet-stream;base64,","");
}
export const downloadAsZip = async (images: Array<{url: string; fileName: string}>, folderName: string) => {
  const zip =  new JsZip();
  const base64Matcher = new RegExp(/^data:image\/(png|jpg|jpeg);base64,/);
  try {
    let counter = 0;
    images.forEach((image) => {
      if(base64Matcher.test(image.url)){
        zip.file(image.fileName,image.url.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),{base64: true});
        counter ++;
      } else {
        zip.file(image.fileName,getDataURL(image.url),{base64: true})
        counter ++;
      }
    });
    if(counter === images.length)
   await zip.generateAsync({type:"blob"}).then(async(content)=>{
        await saveAs(content,folderName)
    })
  } catch (error) {
    Swal.fire("error", "Can't Download you folder");
    console.log(error); // this log is for purpose
  }
 
  
}
export const iscoreStatusColor = (score: any) => {
  let iscoreColor = '';
  let iscorStatus = '';
  if(score < 400 && score >1 ){iscoreColor = '#000000'; iscorStatus = 'متعثر';}
  else if(score >= 400 && score <= 520){iscoreColor = '#ff0000'; iscorStatus = 'مخاطر مرتفعه';}
  else if(score >= 521 && score <= 625){iscoreColor = '#ff9900'; iscorStatus = 'غير مرضى';}
  else if(score >= 626 && score <= 700){iscoreColor = '#ffff00'; iscorStatus = 'مرضى';}
  else if(score >= 701 && score <= 750){iscoreColor = '#99ff00'; iscorStatus = 'جيد جدا';}
  else if(score >= 751 && score <= 850){iscoreColor = '#00ff00'; iscorStatus = 'ممتاز';}
  else if(score > 850){iscoreColor = '#dcf0f7'; iscorStatus = 'ممتاز';}
  else if(score === -1){iscoreColor = '#ffbad2'; iscorStatus = 'خطأ عند الاستعلام';}
  else if(score === 1){iscoreColor = '#c0c0c0'; iscorStatus = 'لا توجد بيانات متاحه';}
  else if(score === 0){iscoreColor = '#ffffff'; iscorStatus = 'التقييم الرقمى غيرمتاح';}
  else {iscoreColor = '#c0c0c0'; iscorStatus = '-';}
  const iScoreStatusObj = {color: iscoreColor, status: iscorStatus}
  return iScoreStatusObj
}

export const getCurrentTime = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    // get time in xx:xx:xx format
    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${
        s < 10 ? `0${s}` : s
    }`;
};

export const getFullCustomerKey = (
  shortenedCode: string
): number | undefined => {
  const re = /\d{1,3}\/\d{1,7}/g;
	const matchResult = shortenedCode.match(re) || [];
	if (!matchResult.length) return undefined;
  const [branch, customer] = matchResult[0].split("/");
  return Number(`11${branch.padStart(3, "0")}${customer.padStart(7, "0")}`);
};

export const guarantorOrderLocal = {
  0: "الضامن الاول",
  1: "الضامن الثاني",
  2: "الضامن الثالث",
  3: "الضامن الرابع",
  4: "الضامن الخامس",
  5: "الضامن السادس",
  6: "الضامن السابع",
  7: "الضامن الثامن",
  8: "الضامن التاسع",
  9: "الضامن العاشر",
  default: "الضامن"
};