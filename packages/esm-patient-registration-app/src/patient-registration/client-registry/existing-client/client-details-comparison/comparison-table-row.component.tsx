import { TableRow, TableCell, Checkbox } from '@carbon/react';
import React, { useState, useEffect } from 'react';
import { type ComparisonTableRowProps } from '../types';

const ComparisonTableRow: React.FC<ComparisonTableRowProps> = ({
  field,
  label,
  amrsValue,
  hieValue,
  onChange,
  allChecked,
}) => {
  const [checked, setChecked] = useState(false);
  const randomString = Math.random().toString(10).substring(2, 6).toUpperCase();
  useEffect(() => {
    onChange?.(allChecked, field, hieValue, true);
    setChecked(allChecked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecked]);

  return (
    <TableRow>
      <TableCell>
        <p style={{ color: amrsValue!.trim().toUpperCase() == hieValue!.trim().toUpperCase() ? '' : 'red' }}>{label}</p>
      </TableCell>
      <TableCell>{amrsValue}</TableCell>
      <TableCell>{hieValue}</TableCell>
      <TableCell>
        <Checkbox
          id={`cbox-${randomString}`}
          onChange={(e) => {
            onChange(e.target.checked, field, hieValue, false);
            setChecked(e.target.checked);
          }}
          checked={checked}
        />
      </TableCell>
    </TableRow>
  );
};

export default ComparisonTableRow;
