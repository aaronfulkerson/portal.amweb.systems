import { FunctionComponent } from 'react'
import {
  Checkbox,
  FormGroup,
  HTMLSelect,
  ICheckboxProps,
  IHTMLSelectProps,
  IInputGroupProps,
  InputGroup,
  INumericInputProps,
  ISwitchProps,
  ITextAreaProps,
  NumericInput,
  Switch,
  TextArea,
} from '@blueprintjs/core'
import { FieldInputProps, useField } from 'react-final-form'

interface IAdapter<FieldValue, T extends HTMLElement = HTMLElement> {
  input: FieldInputProps<FieldValue, T>
}

export const CheckboxAdapter: FunctionComponent<
  IAdapter<boolean, HTMLInputElement> & ICheckboxProps
> = ({ input: { onBlur, onFocus, value, ...input }, ...props }) => {
  const {
    meta: { error, touched },
  } = useField(input.name)

  const intent = touched && error ? 'warning' : 'none'

  return (
    <FormGroup helperText={touched && error} intent={intent}>
      <Checkbox {...input} {...props} />
    </FormGroup>
  )
}

export const HTMLSelectAdapter: FunctionComponent<
  IAdapter<string, HTMLSelectElement> & IHTMLSelectProps
> = ({ input: { multiple, ...input }, ...props }) => {
  const {
    meta: { error, touched },
  } = useField(input.name)

  const intent = touched && error ? 'warning' : 'none'

  return (
    <FormGroup helperText={touched && error} intent={intent}>
      <HTMLSelect {...input} {...props} />
    </FormGroup>
  )
}

export const InputGroupAdapter: FunctionComponent<
  IAdapter<string, HTMLInputElement> & IInputGroupProps & { password?: boolean }
> = ({ input, password, ...props }) => {
  const {
    meta: { error, touched },
  } = useField(input.name)

  const intent = touched && error ? 'warning' : 'none'

  return (
    <FormGroup helperText={touched && error} intent={intent}>
      <InputGroup {...input} {...props} intent={intent} type={password ? 'password' : 'text'} />
    </FormGroup>
  )
}

export const NumericInputAdapter: FunctionComponent<
  IAdapter<string, HTMLInputElement> & INumericInputProps
> = ({ input, ...props }) => {
  const {
    meta: { error, touched },
  } = useField(input.name)

  const intent = touched && error ? 'warning' : 'none'

  return (
    <FormGroup helperText={touched && error} intent={intent}>
      <NumericInput
        {...input}
        {...props}
        intent={intent}
        onValueChange={(_, value) => input.onChange(value)}
      />
    </FormGroup>
  )
}

export const SwitchAdapter: FunctionComponent<
  IAdapter<boolean, HTMLInputElement> & ISwitchProps
> = ({ input: { onBlur, onFocus, value, ...input }, ...props }) => {
  const {
    meta: { error, touched },
  } = useField(input.name)

  const intent = touched && error ? 'warning' : 'none'

  return (
    <FormGroup helperText={touched && error} intent={intent}>
      <Switch {...input} {...props} />
    </FormGroup>
  )
}

export const TextAreaAdapter: FunctionComponent<
  IAdapter<string, HTMLTextAreaElement> & ITextAreaProps
> = ({ input, ...props }) => {
  const {
    meta: { error, touched },
  } = useField(input.name)

  const intent = touched && error ? 'warning' : 'none'

  return (
    <FormGroup helperText={touched && error} intent={intent}>
      <TextArea {...input} {...props} intent={intent} />
    </FormGroup>
  )
}
