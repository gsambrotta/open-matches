import { Button as ButtonGrommet } from 'grommet'
import styled from 'styled-components'

export const Button = styled(ButtonGrommet)`
  font-family: var(--headerFont);
`

export const ButtonPrimary = styled(Button)`
  color: var(--backgroundColor);
  text-transform: uppercase;
  font-size: 15px;
`
