import Swal from 'sweetalert2'

import local from '../../../Shared/Assets/ar.json'

export const handleUpdateSuccess = async (callback: () => void, label = '') => {
  await Swal.fire({
    title: `${local.done} ${label}`,
    icon: 'success',
    confirmButtonText: local.end,
  })

  callback()
}
