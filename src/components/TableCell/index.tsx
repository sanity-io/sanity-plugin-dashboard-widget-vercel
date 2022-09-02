import { Box, Label } from '@sanity/ui'
import React, { ReactNode } from 'react'
import { Sanity } from '../../types'

type Props = {
  children: ReactNode
  colSpan?: number
  header?: boolean
  variant?: 'age' | 'branch' | 'creator' | 'state'
}

const TableCell = (props: Props) => {
  const { children, colSpan, header, variant } = props

  let display: Sanity.BoxDisplay | Sanity.BoxDisplay[] = 'table-cell'
  let cellWidth = 'auto'

  switch (variant) {
    case 'age':
      cellWidth = '50px'
      break
    case 'branch':
      cellWidth = '300px'
      display = ['none', 'none', 'none', 'table-cell']
      break
    case 'creator':
      cellWidth = '80px'
      break
    case 'state':
      cellWidth = '110px'
      display = ['none', 'none', 'none', 'none', 'table-cell']
      break
  }

  if (header) {
    return (
      <Box
        as="th"
        colSpan={colSpan}
        // @ts-expect-error types
        display={display}
        paddingX={3}
        paddingY={2}
        style={{
          maxWidth: cellWidth,
          position: 'relative',
          textAlign: 'left',
          width: cellWidth,
        }}
      >
        <Label size={0}>{children}</Label>
      </Box>
    )
  } else {
    return (
      <Box
        as="td"
        colSpan={colSpan}
        // @ts-expect-error types
        display={display}
        paddingX={3}
        paddingY={[2, 2, 3]}
        style={{
          borderTop: '1px solid #eee',
          maxWidth: cellWidth,
          position: 'relative',
          textAlign: 'left',
          width: cellWidth,
        }}
      >
        {children}
      </Box>
    )
  }
}

export default TableCell
