import React, { useState } from 'react';
import { Checkbox, ListItemIcon } from '@mui/material';
import MemberRegister, { MemberRegisterProps } from './MemberRegister';

export interface SelectableMemberRegisterProps extends Omit<MemberRegisterProps, 'members'> {
  members: string[];
  selected: boolean[];
  onToggle: (idx: number) => void;
}

const SelectableMemberRegister = ({ members, selected, onToggle, ...rest }: SelectableMemberRegisterProps) => {
  return (
    <MemberRegister
      members={members}
      {...rest}
      renderListItem={(name: any, idx: number, children: any) => (
        <>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={selected[idx]}
              tabIndex={-1}
              disableRipple
              onChange={() => onToggle(idx)}
              inputProps={{ 'aria-labelledby': `checkbox-list-label-${idx}` }}
            />
          </ListItemIcon>
          {children}
        </>
      )}
    />
  );
};

export default SelectableMemberRegister;
