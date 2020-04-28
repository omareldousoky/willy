export const englishToArabic = (status: string) => {
    switch (status) {
      case 'underReview':
        return 'تحت التحرير';
      case 'reviewed':
        return 'رُجعت';
      case 'rejected':
        return 'مرفوضة';
      case 'approved':
        return 'موافق عليها';
      case 'created':
        return 'إنشاء';
      case 'issued':
        return 'أصدرت';
      default: return '';
    }
  }