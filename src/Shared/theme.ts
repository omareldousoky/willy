import { Theme } from 'react-select'

export const theme = {
  colors: {
    primary: '#7dc356',
    primaryLight: '#f7fff2',
    blackText: '#2f2f2f',
    lightGrayText: '#6e6e6e',
    veryLightGray: '#e5e5e5',
    basicBackground: '#ffffff',
  },
  selectStyleWithBorder: {
    control: (provided) => ({
      ...provided,
      '&:hover': { borderColor: theme.colors.primary }, // border style on hover
      border: `1px solid ${theme.colors.veryLightGray}`, // default border color
      boxShadow: 'none', // no box-shadow
    }),
  },
  selectStyleWithBorderWithSearchDropDown: {
    control: (provided) => ({
      ...provided,
      '&:hover': { borderColor: theme.colors.primary }, // border style on hover
      border: `1px solid ${theme.colors.veryLightGray}`, // default border color
      borderTopRightRadius: `0`,
      borderBottomRightRadius: `0`,
      boxShadow: 'none', // no box-shadow
    }),
  },
  selectStyleWithoutBorder: {
    control: (provided) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      '&:hover': {
        border: 'none',
      },
    }),
  },
  selectTheme: (selectTheme: Theme) => ({
    ...selectTheme,
    colors: {
      ...selectTheme.colors,
      primary: '#7dc356',
      primary25: '#7dc25661',
      primary50: '#7dc356',
      neutral5: '#e9ecef',
      neutral10: '#e9ecef',
    },
  }),
}
