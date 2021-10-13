import jwtDecode from 'jwt-decode'
import JsZip from 'jszip'
import { saveAs } from 'file-saver'
import Swal from 'sweetalert2'
import differenceInYears from 'date-fns/differenceInYears'
import * as local from '../Assets/ar.json'
import errorMessages from '../Assets/errorMessages.json'
import { API_BASE_URL } from '../envConfig'
import { getCookie } from './getCookie'

export const timeToDate = (timeStampe: number): any => {
  if (timeStampe > 0) {
    const date = new Date(timeStampe).toLocaleDateString()
    return date
  }
  return ''
}
export const timeToDateyyymmdd = (timeStamp: number): any => {
  if (timeStamp === -1) {
    return new Date().toISOString().slice(0, 10)
  }
  if (timeStamp !== undefined && !Number.isNaN(timeStamp))
    return new Date(timeStamp).toISOString().slice(0, 10)
}

export function parseJwt(token: string) {
  try {
    return jwtDecode(token)
  } catch (e) {
    return null
  }
}
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
    case 'company':
      return local.company
    default:
      return ''
  }
}
export function getErrorMessage(key: string) {
  if (key && errorMessages[key]) return errorMessages[key].ar

  return errorMessages.default_error.ar
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
  const dateNow = new Date()
  const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425
  const years = Math.floor((dateNow.getTime() - val) / MS_PER_YEAR)
  return years
}

export function checkIssueDate(issueDate) {
  const date = new Date(issueDate).valueOf()
  const endOfDay: Date = new Date()
  endOfDay.setHours(23, 59, 59, 59)
  const diffTime = Math.abs(endOfDay.valueOf() - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  // 2555 = 7 years
  if (diffDays > 2555) {
    return local.expired
  }
  return ''
}

export const combinePaths = (parent, child) =>
  `${parent.replace(/\/$/, '')}/${child.replace(/^\//, '')}`

export const buildPaths = (routes, parentPath = '') =>
  routes.map((route) => {
    const path = combinePaths(parentPath, route.path)

    return {
      ...route,
      path,
      ...(route.routes && { routes: buildPaths(route.routes, path) }),
    }
  })

export const setupParents = (routes, parentRoute = {}) =>
  routes.map((route) => {
    const withParent = {
      ...route,
      ...(parentRoute && { parent: parentRoute }),
    }

    return {
      ...withParent,
      ...(withParent.routes && {
        routes: setupParents(withParent.routes, withParent),
      }),
    }
  })

export const flattenRoutes = (routes) =>
  routes
    .map((route) => [route.routes ? flattenRoutes(route.routes) : [], route])
    .flat(Infinity)

export const generateAppRoutes = (routes) => {
  return flattenRoutes(setupParents(buildPaths(routes)))
}

export const pathTo = (route) => {
  if (!route.parent) {
    return [route]
  }

  return [...pathTo(route.parent), route]
}

// allow `0` to be replaced
/* 
	inputs sometimes include "-" which is considered as English text. it used to flip the number
	e.g. 2333-456 => ٢٣٣٣-٤٥٦ 
	When we mix that with the arabic number, which you want to appear left-to-right
	so we append Left-to-Right Marker character "\u200E" which indicates how text will be rendered
	https://stackoverflow.com/a/34903965

	pass withLTRControlChar = false in case we want to use number with arabic word
	so we won't change direction of the arabic word
	e.g. ٣ أشهر
*/
export const numbersToArabic = (
  input?: number | string,
  withLTRControlChar = true
) => {
  const toArabic =
    input === undefined
      ? '٠'
      : input.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])
  return withLTRControlChar ? toArabic.replace(/./g, '\u200E$&') : toArabic
}

export const timeToArabicDateNow = (fullDate: boolean): string => {
  return fullDate
    ? new Date().toLocaleString('ar-EG')
    : new Date().toLocaleDateString('ar-EG')
}
export const timeToArabicDate = (
  timeStamp: number,
  fullDate: boolean
): string => {
  return fullDate
    ? new Date(timeStamp).toLocaleString('ar-EG')
    : new Date(timeStamp).toLocaleDateString('ar-EG')
}
export const dayToArabic = (index: number): string => {
  const weekday = [
    local.sunday,
    local.monday,
    local.tuesday,
    local.wednesday,
    local.thursday,
    local.friday,
    local.saturday,
  ]
  return weekday[index]
}
export const customFilterOption = (option, rawInput) => {
  if (option.label) {
    const words = rawInput.split(' ')
    return words.reduce(
      (acc, cur) =>
        acc && option.label.toLowerCase().includes(cur.toLowerCase()),
      true
    )
  }
}
export function arabicGender(gender: string) {
  switch (gender) {
    case 'male':
      return local.male
    case 'female':
      return local.female
    default:
      return ''
  }
}

export const download = (url, fileName: string): void => {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  a.remove()
}

export const getStatus = (installment) => {
  const todaysDate = new Date().setHours(0, 0, 0, 0).valueOf()
  switch (installment.status) {
    case 'unpaid':
      if (
        new Date(installment.dateOfPayment).setHours(23, 59, 59, 59) <
        todaysDate
      )
        return local.late
      return local.unpaid
    case 'pending':
      return local.pending
    case 'paid':
      return local.paid
    case 'partiallyPaid':
      return local.partiallyPaid
    case 'rescheduled':
      return `${local.rescheduled}${
        installment.earlyPaymentReschedule ? ' - ' + local.earlyPayment : ''
      }`
    case 'cancelled':
      return local.cancelled
    case 'canceled':
      return local.cancelled
    case 'issued':
      return local.issued
    default:
      return ''
  }
}
export const getInstallmentStatus = (status: string) => {
  switch (status) {
    case 'unpaid':
      return local.unpaid
    case 'pending':
      return local.pending
    case 'paid':
      return local.paid
    case 'partiallyPaid':
      return local.partiallyPaid
    case 'rescheduled':
      return local.rescheduled
    case 'cancelled':
      return local.cancelled
    case 'issued':
      return local.issued
    default:
      return ''
  }
}
export const getIscoreReportStatus = (status: string) => {
  switch (status) {
    case 'queued':
      return local.queued
    case 'processing':
      return local.processing
    case 'created':
      return local.created
    case 'failed':
      return local.failed
    case 'emptyResponse':
      return local.noResults
    default:
      return ''
  }
}
export const getLoanStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return local.pending
    case 'paid':
      return local.paid
    case 'partiallyPaid':
      return local.partiallyPaid
    case 'rescheduled':
      return local.rescheduled
    case 'cancelled':
      return local.cancelled
    case 'canceled':
      return local.cancelled
    case 'issued':
      return local.issued
    case 'created':
      return local.created
    case 'underReview':
      return local.underReview
    case 'reviewed':
      return local.reviewed
    case 'secondReview':
      return local.secondReviewed
    case 'thirdReview':
      return local.thirdReviewed
    case 'approved':
      return local.approved
    case 'writtenOff':
      return local.writtenOffLoan
    case 'Doubtful':
      return local.doubtedLoan
    case 'doubt_cancelled':
      return local.cancelled
    default:
      return ''
  }
}

export const getTimestamp = (datetimeString: string) => {
  const dateTime = datetimeString.split(' ')
  const datum = new Date(dateTime[0]).valueOf()
  return datum
}
export const iscoreDate = (date: any) => {
  const iscoreDateVal = new Date(date)
  const iscoreDateString =
    ('0' + iscoreDateVal.getDate()).slice(-2) +
    '/' +
    ('0' + (iscoreDateVal.getMonth() + 1)).slice(-2) +
    '/' +
    iscoreDateVal.getFullYear()
  return iscoreDateString
}

export const getDateString = (date: any) => {
  return new Date(
    new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
  )
    .toISOString()
    .split('T')[0]
}

export const downloadFile = (fileURL) => {
  const link = document.createElement('a')
  link.href = fileURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export const getAge = (DOB) => {
  const today = new Date()
  const birthDate = new Date(DOB)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return age
}

export const getRandomPaymentByKey = (key) => {
  if (key === 'collectionCommission') return local.collectionCommission
  if (key === 'reissuingFees') return local.reissuingFees
  if (key === 'legalFees') return local.legalFees
  if (key === 'clearanceFees') return local.clearanceFees
  if (key === 'toktokStamp') return local.toktokStamp
  if (key === 'tricycleStamp') return local.tricycleStamp
  if (key === 'penalty') return local.payPenalty
}
export const getDataURL = async (url) => {
  const blob = await fetch(url).then((r) => r.blob())
  const dataUrl: any = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
  const res = await dataUrl.replace('data:application/octet-stream;base64,', '')
  return res
}
export const downloadAsZip = async (
  images: Array<{ url: string; fileName: string }>,
  folderName: string
) => {
  const zip = new JsZip()
  const base64Matcher = new RegExp(/^data:image\/(png|jpg|jpeg);base64,/)
  try {
    let counter = 0
    images.forEach((image) => {
      if (base64Matcher.test(image.url)) {
        zip.file(
          image.fileName,
          image.url.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
          { base64: true }
        )
        counter += 1
      } else {
        zip.file(image.fileName, getDataURL(image.url), { base64: true })
        counter += 1
      }
    })
    if (counter === images.length)
      await zip.generateAsync({ type: 'blob' }).then(async (content) => {
        await saveAs(content, folderName)
      })
  } catch (error) {
    Swal.fire('error', "Can't Download you folder")
    console.log(error) // this log is for purpose
  }
}
export const iscoreStatusColor = (score: any) => {
  let iscoreColor = ''
  let iscorStatus = ''
  if (score < 400 && score > 1) {
    iscoreColor = '#000000'
    iscorStatus = 'متعثر'
  } else if (score >= 400 && score <= 520) {
    iscoreColor = '#ff0000'
    iscorStatus = 'مخاطر مرتفعه'
  } else if (score >= 521 && score <= 625) {
    iscoreColor = '#ff9900'
    iscorStatus = 'غير مرضى'
  } else if (score >= 626 && score <= 700) {
    iscoreColor = '#ffff00'
    iscorStatus = 'مرضى'
  } else if (score >= 701 && score <= 750) {
    iscoreColor = '#99ff00'
    iscorStatus = 'جيد جدا'
  } else if (score >= 751 && score <= 850) {
    iscoreColor = '#00ff00'
    iscorStatus = 'ممتاز'
  } else if (score > 850) {
    iscoreColor = '#dcf0f7'
    iscorStatus = 'ممتاز'
  } else if (score === -1) {
    iscoreColor = '#ffbad2'
    iscorStatus = 'خطأ عند الاستعلام'
  } else if (score === 1) {
    iscoreColor = '#c0c0c0'
    iscorStatus = 'لا توجد بيانات متاحه'
  } else if (score === 0) {
    iscoreColor = '#ffffff'
    iscorStatus = 'التقييم الرقمى غيرمتاح'
  } else {
    iscoreColor = '#c0c0c0'
    iscorStatus = ''
  }
  const iScoreStatusObj = { color: iscoreColor, status: iscorStatus }
  return iScoreStatusObj
}

export const getCurrentTime = () => {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()
  // get time in xx:xx:xx format
  return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${
    s < 10 ? `0${s}` : s
  }`
}

export const getFullCustomerKey = (
  shortenedCode: string
): number | undefined => {
  const re = /\d{1,3}\/\d{1,7}/g
  const matchResult = shortenedCode.match(re) || []
  if (!matchResult.length) return undefined
  const [branch, customer] = matchResult[0].split('/')
  return Number(`11${branch.padStart(3, '0')}${customer.padStart(7, '0')}`)
}

export const guarantorOrderLocal = {
  0: 'الضامن الاول',
  1: 'الضامن الثاني',
  2: 'الضامن الثالث',
  3: 'الضامن الرابع',
  4: 'الضامن الخامس',
  5: 'الضامن السادس',
  6: 'الضامن السابع',
  7: 'الضامن الثامن',
  8: 'الضامن التاسع',
  9: 'الضامن العاشر',
  default: 'الضامن',
}

export const promissoryNoteGuarantorOrderLocal = {
  0: 'ضامن متضامن أول',
  1: 'ضامن متضامن ثان',
  2: 'ضامن متضامن ثالث',
  3: 'ضامن متضامن رابع',
  4: 'ضامن متضامن خامس',
  5: 'ضامن متضامن سادس',
  6: 'ضامن متضامن سابع',
  7: 'ضامن متضامن ثامن',
  8: 'ضامن متضامن تاسع',
  9: 'ضامن متضامن عاشر',
  default: 'ضامن متضامن',
}

export const orderLocal = {
  0: 'الاول',
  1: 'الثاني',
  2: 'الثالث',
  3: 'الرابع',
  4: 'الخامس',
  5: 'السادس',
  6: 'السابع',
  7: 'الثامن',
  8: 'التاسع',
  9: 'العاشر',
  default: 'العميل',
}

export const convertToTimestamp = (date?: string | number): number => {
  const today = new Date().valueOf()
  return date ? new Date(date).valueOf() || today : today
}

export const groupBy = (
  list: Record<string, unknown>[],
  keyGetter: (item: Record<string, unknown>) => unknown
) => {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export const iscoreBank = (bankId: string) => {
  switch (bankId) {
    case 'CB01280001':
      return 'المصرف المتحد'
    case 'CB13000001':
      return 'البنك التجارى الدولى (ريفى)'
    case 'CB14000001':
      return 'بنك بلوم مصر'
    case 'CB15000001':
      return 'بنك الامارات دبى الوطنى'
    case 'CB19000001':
      return 'بنك عوده'
    case 'CB23000001':
      return 'بنك فيصل الاسلامى'
    case 'CB24000001':
      return 'بنك بيريوس'
    case 'CB25010001':
      return 'البنك الوطنى للتنمية'
    case 'CB27000001':
      return 'بنك الكويت الوطنى'
    case 'CB30000001':
      return 'بنك الاتحاد الوطنى'
    case 'CB32000001':
      return 'البنك المصرى الخليجى'
    case 'CB33010001':
      return 'HSBC'
    case 'FB38000001':
      return 'بنك المشرق'
    case 'FB39000001':
      return 'البنك العربى'
    case 'FB51000001':
      return 'بنك ابوظبى الوطنى'
    case 'FB53000001':
      return 'سيتى بنك ان اية'
    case 'IB41000001':
      return 'بنك باركليز'
    case 'IB43000001':
      return 'بنك الشركه المصرفيه العربيه'
    case 'IB44000001':
      return 'بنك كريدى اجريكول'
    case 'IB45000001':
      return 'البنك الاهلى سوسيتية جنرال'
    case 'IB47000001':
      return 'بنك التعمير والاسكان'
    case 'IB49000001':
      return 'بنك المؤسسه العربيه المصرفيه'
    case 'MF00010001':
      return 'جمعيات متناهية الصغر(تنميه)'
    case 'MF00020000':
      return 'جمعيات متناهية الصغر'
    case 'MF00020001':
      return 'جمعية رجال أعمال الاسكندريه'
    case 'MF00020003':
      return 'جمعية رجال الاعمال و المستثمرين بالدقهليه'
    case 'MF00020156':
      return 'جمعية سيدات اعمال اسيوط'
    case 'MF00021032':
      return 'جمعية رجال اعمال اسيوط'
    case 'MF00021040':
      return 'الجمعيه المصريه'
    case 'MF00021057':
      return 'جمعية تحفيظ القرآن'
    case 'MF00021373':
      return 'جمعية كاريتاس'
    case 'MF00021375':
      return 'الجمعيه الاقليميه للتنميه والمشروعات'
    case 'MF00021424':
      return 'جمعية الامومه و الطفوله'
    case 'MF00030001':
      return 'جمعيات متناهية الصغر(ريفى)'
    case 'MF00040001':
      return 'تساهيل'
    case 'MF00050001':
      return 'مؤسسه تضامن '
    case 'MF00060001':
      return 'جمعيى تنمية المشروعات الصغيرة ببورسعيد'
    case 'MF00070001':
      return 'الهيئه القبطيه الانجيليه'
    case 'MF00080001':
      return 'جمعيات متناهية الصغر(تضامن)'
    case 'MF00100001':
      return 'شركة تنميه'
    case 'MF00110001':
      return 'شركة امان للتمويل متناهى الصغر'
    case 'MF00120001':
      return 'شركة تمويلى'
    case 'NB00010001':
      return 'الصندوق الاجتماعى للتنمية'
    case 'NB95000001':
      return 'بنك ناصر الاجتماعى'
    case 'PC01000001':
      return 'بنك الاسكندرية'
    case 'PC02000001':
      return 'البنك الاهلى المصرى'
    case 'PC03000001':
      return 'بنك القاهرة'
    case 'PC04000001':
      return 'بنك مصر'
    case 'SB80000001':
      return 'بنك التنميه الصناعيه المصرى'
    case 'SB82010001':
      return 'البنك الرئيسى للتنمية والائتمان الزراعى'
    default:
      return 'not  found'
  }
}

export const arrayToPairs = <T extends unknown>(array: any[]): T[][] =>
  array.reduce(
    (result, value, index, sourceArray) =>
      index % 2 === 0
        ? [...result, sourceArray.slice(index, index + 2)]
        : result,
    []
  )

export const extractLastChars = (str: string, numberOfChars: number) =>
  str?.slice ? str.slice(str.length - numberOfChars, str.length) : str

export const DateAsFileName = () => {
  const today = new Date()
  const date =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
  const time =
    today.getHours() + '.' + today.getMinutes() + '.' + today.getSeconds()
  const dateTime = date + ' ' + time
  return dateTime
}

export const DownloadAsCsv = async (name: string, data: string) => {
  const blob = new Blob([data], {
    type: 'data:text/csv;charset=utf-8,',
  })
  const blobURL = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.download = `${name} ${DateAsFileName()}.csv`
  anchor.dir = 'rtl'
  anchor.href = blobURL
  anchor.dataset.downloadurl = ['text/csv', anchor.download, anchor.href].join(
    ','
  )
  anchor.click()
}

export const errorResponseHandler = (error: string) =>
  Swal.fire('Error !', getErrorMessage(error), 'error')

export const formatMoney = (money: string | number) => {
  const moneyNumber = Number(money)
  if (Number.isNaN(moneyNumber)) return money
  return moneyNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Extract GMT date from a timestamp
export const extractGMTDate = (date: number) => {
  const dateInstance = new Date(date)
  if (!(dateInstance instanceof Date)) return date
  return numbersToArabic(
    dateInstance.toISOString().split('T')[0].replace(/-/g, '/'),
    true
  )
}

export const removeEmptyArg = (obj) => {
  Object.keys(obj).forEach((el) => {
    if (obj[el] === '' || obj[el] === undefined) {
      delete obj[el]
    }
  })
  return obj
}

export const generateArrayOfYears = () => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 40 }).map(
    (_, index) => currentYear - index
  )

  return years
}
export const getRenderDate = (date: number) => {
  const today = new Date(date)
  let dd: string | number = today.getDate()
  let mm: string | number = today.getMonth() + 1
  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }
  return dd + '-' + mm + '-' + yyyy
}

export const getDateAndTime = (date: number) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }
  const dateString = new Date(date).toLocaleTimeString('ar-EG', options)
  return dateString
}

export const isCF = API_BASE_URL?.includes('cf') ?? false

export const addYearToTimeStamp = (timeStamp: number) => {
  const currDate = new Date(timeStamp)
  const nextYearDate = new Date(
    currDate.setFullYear(currDate.getFullYear() + 1)
  )

  return nextYearDate.toLocaleDateString('ar-EG')
}
export const getIndexInArabic = (index: number) => {
  switch (index) {
    case 0:
      return ['ثالثا', 'ثالث']
    case 1:
      return ['رابعا', 'رابع']
    case 2:
      return ['خامسا', 'خامس']
    case 3:
      return ['سادسا', 'سادس']
    case 4:
      return ['سابعا', 'سابع']
    case 5:
      return ['ثامنا', 'ثامن']
    default:
      return ['', '']
  }
}

export const getNumbersOfGuarantor = (
  str: string,
  guarantorsLength: number
) => {
  let modifiedStr = str
  if (modifiedStr === 'and') modifiedStr = 'و'
  else modifiedStr = 'او'
  switch (guarantorsLength) {
    case 1:
      return ` الثالث`
    case 2:
      return ` الثالث ${modifiedStr} الرابع`
    case 3:
      return ` الثالث ${modifiedStr} الرابع ${modifiedStr} الخامس`
    case 4:
      return `الثالث ${modifiedStr} الرابع ${modifiedStr} الخامس ${modifiedStr} السادس `
    case 5:
      return `الثالث ${modifiedStr} الرابع ${modifiedStr} الخامس ${modifiedStr} السادس ${modifiedStr} السابع `
    case 6:
      return `الثالث ${modifiedStr} الرابع ${modifiedStr} الخامس ${modifiedStr} السادس ${modifiedStr} السابع ${modifiedStr} الثامن `
    default:
      return ''
  }
}
export const getIndexOfGuarantorInAr = (index: number) => {
  switch (index) {
    case -2:
      return 'الأول'
    case -1:
      return 'الثاني'
    case 0:
      return 'الثالث'
    case 1:
      return 'الرابع'
    case 2:
      return 'الخامس'
    case 3:
      return 'السادس'
    case 4:
      return 'السابع'
    case 5:
      return 'الثامن'
    default:
      return ''
  }
}

export const loanChipStatusClass: Record<string, string> = {
  paid: 'paid',
  issued: 'unpaid',
  pending: 'pending',
  canceled: 'canceled',
  default: '',
}

// https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tolocalestring_date_all
// en-CA: yyyy-mm-dd
export const getFormattedLocalDate = (timestamp: number, locale = 'en-CA') =>
  new Date(timestamp).toLocaleDateString(locale)

export const statusLocale = {
  underReview: { text: 'تحت التحرير', color: '#ed7600' },
  reviewed: { text: 'رُجعت', color: '#edb600' },
  secondReview: { text: 'رُجعت من مدير الفرع', color: '#edb679' },
  thirdReview: { text: 'رُجعت من مدير المركز', color: '#f4c109' },
  rejected: { text: 'مرفوضة', color: '#d51b1b' },
  canceled: { text: 'ملغى', color: '#d51b1b' },
  approved: { text: 'موافق عليها', color: '#009bed' },
  created: { text: 'تم الإنشاء', color: '#2a3390' },
  issued: { text: 'أصدرت', color: '#7dc356' },
  paid: { text: 'مدفوع', color: '#7dc356' },
  pending: { text: 'قيد التحقيق', color: '#edb600' },
  default: {},
}

export const cfLimitStatusLocale = {
  approved: { text: 'الحد الائتماني موافق عليه', color: '#009bed' },
  'pending-update': {
    text: 'تعديل الحد الائتماني قيد التحقيق',
    color: '#edb600',
  },
  'pending-initialization': {
    text: 'الحد الائتماني المبدئي قيد التحقيق',
    color: '#edb600',
  },
  'update-reviewed': {
    text: 'تم مراجعه الحد الائتماني',
    color: '#edb600',
  },
  'initialization-reviewed': {
    text: 'تم مراجعه الحد الائتماني المبدئي',
    color: '#edb600',
  },
  default: { text: 'الحد الائتماني المبدئي قيد التحقيق', color: '#edb600' },
}

export const removeDuplicatesByName = (list: { name: string }[]) =>
  list?.length
    ? [...list].filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.name === item.name)
      )
    : list

export const getBranchFromCookie = (branchName = 'ltsbranch') => {
  return getCookie(branchName) ? JSON.parse(getCookie(branchName))._id : ''
}
export const calculateAge = (dateOfBirth: number) => {
  if (dateOfBirth) {
    return differenceInYears(Date.now().valueOf(), dateOfBirth)
  }
  return 0
}

export const getBranchFromCookie = (branchName = 'ltsbranch') => {
  return getCookie(branchName) ? JSON.parse(getCookie(branchName))._id : ''
}
