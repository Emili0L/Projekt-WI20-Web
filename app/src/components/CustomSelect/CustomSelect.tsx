import React from "react";
import Select, { GroupBase, Props } from "react-select";

const CustomSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>
) => {
  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided: any, state: any) => {
      return {
        ...provided,
        minHeight: "40px",
        outlineOffset: state.isFocused ? "2px" : 0,
        outline: state.isFocused ? "2px solid var(--color-primary)" : "none",
        boxShadow: "none",
        fontSize: "14px",
        borderColor: "var(--color-grey-200)",
        transition: state.isFocused ? "none" : provided.transition,
        "&:hover": {
          borderColor: "var(--color-grey-300)",
        },
      };
    },
    option: (
      provided: any,
      { data, isDisabled, isFocused, isSelected }: any
    ) => {
      return {
        ...provided,
        cursor: isDisabled ? "not-allowed" : "pointer",
        backgroundColor:
          isSelected && !isDisabled
            ? "var(--color-orange-300)"
            : "var(--color-white)",
        "&:hover": {
          backgroundColor: !isDisabled
            ? "var(--color-orange-100)"
            : "var(--color-white)",
          color: !isDisabled ? "var(--color-black)" : "var(--color-grey-500)",
        },
      };
    },
    menu: (base: any) => ({
      ...base,
      zIndex: 1000,
      position: "absolute",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 1000,
      position: "absolute",
    }),
    menuList: (base: any) => ({
      ...base,
    }),
    ...props.styles,
  };

  return <Select {...props} styles={customStyles} />;
};

export { CustomSelect };
