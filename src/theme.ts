export const theme = {
    colors:{
        primary: "#7dc356",
        primaryLight: "#f7fff2",
        blackText: "#2f2f2f",
        lightGrayText:'#6e6e6e',
        veryLightGray:"#e5e5e5",
        basicBackground: "#ffffff",
    } ,
     selectStyle: {
        control: base => ({
            ...base,
            "&:hover": { borderColor: theme.colors.primary }, // border style on hover
            border: `1px solid ${theme.colors.veryLightGray}`, // default border color
            boxShadow: "none" // no box-shadow
          }),
          menu: (base, state) => ({
            ...base,
            border: `1px solid ${theme.colors.veryLightGray}`,
          }),
          menuList: base => ({
            ...base,
            backgroundColor: theme.colors.basicBackground,
          }),
          //#a3a3a3
          multiValue: base => ({
            ...base,
            backgroundColor: theme.colors.veryLightGray,
            color: "#a3a3a3",
            borderRadius: "20px"
          }),
          multiValueRemove: base => ({
            ...base,
            "&:hover": {
              backgroundColor: theme.colors.primaryLight,
              color:theme.colors.primary,
            }
          }),
          multiValueLabel: base => ({
              ...base,
              color: theme.colors.blackText,
          }),
          option: (base, state) => ({
            ...base,
            color: theme.colors.blackText,
            "&:hover": { backgroundColor: theme.colors.primaryLight },
            backgroundColor: state.isFocused ? theme.colors.basicBackground : "inhert",
            "&:active": { backgroundColor: theme.colors.primary }
          })
        },
    
      
}