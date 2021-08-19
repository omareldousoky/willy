export const englishToArabic = (status: string) => {
  switch (status) {
    case 'underReview':
      return { text: 'تحت التحرير', color: '#ed7600' }
    case 'reviewed':
      return { text: 'رُجعت', color: '#edb600' }
    case 'secondReview':
      return { text: 'رُجعت من مدير الفرع', color: '#edb679' }
    case 'thirdReview':
      return { text: 'رُجعت من مدير المركز', color: '#f4c109' }
    case 'rejected':
      return { text: 'مرفوضة', color: '#d51b1b' }
    case 'canceled':
      return { text: 'ملغى', color: '#d51b1b' }
    case 'approved':
      return { text: 'موافق عليها', color: '#009bed' }
    case 'created':
      return { text: 'تم الإنشاء', color: '#2a3390' }
    case 'issued':
      return { text: 'أصدرت', color: '#7dc356' }
    case 'paid':
      return { text: 'مدفوع', color: '#7dc356' }
    case 'pending':
      return { text: 'قيد التحقيق', color: '#edb600' }
    default:
      return {}
  }
}

export const englishToArabicCFLimitStatus = (status: string) => {
  switch (status) {
    case 'approved':
      return { text: 'الحد الائتماني موافق عليه', color: '#009bed' }
    case 'pending-update':
      return { text: 'تعديل الحد الائتماني قيد التحقيق', color: '#edb600' }
    case 'pending-initialization':
      return { text: 'الحد الائتماني المبدئي قيد التحقيق', color: '#edb600' }
    default:
      return { text: 'الحد الائتماني المبدئي قيد التحقيق', color: '#edb600' }
  }
}
