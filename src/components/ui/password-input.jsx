import {
  Box,
  HStack,
  IconButton,
  Input,
  Stack,
  mergeRefs,
  useControllableState,
} from '@chakra-ui/react'
import * as React from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { InputGroup } from './input-group'

export const PasswordInput = React.forwardRef(
  function PasswordInput(props, ref) {
    const {
      rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
      ...rest
    } = props

    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    })

    const inputRef = React.useRef(null)

    return (
      <InputGroup
        width='full'
        endElement={
          <VisibilityTrigger
            disabled={rest.disabled}
            onPointerDown={(e) => {
              if (rest.disabled) return
              if (e.button !== 0) return
              e.preventDefault()
              setVisible(!visible)
            }}
          >
            {visible ? visibilityIcon.off : visibilityIcon.on}
          </VisibilityTrigger>
        }
        {...rootProps}
      >
        <Input
          {...rest}
          ref={mergeRefs(ref, inputRef)}
          type={visible ? 'text' : 'password'}
        />
      </InputGroup>
    )
  },
)

const VisibilityTrigger = React.forwardRef(
  function VisibilityTrigger(props, ref) {
    return (
      <IconButton
        tabIndex={-1}
        ref={ref}
        me='-2'
        aspectRatio='square'
        size='sm'
        variant='ghost'
        height='calc(100% - {spacing.2})'
        aria-label='Toggle password visibility'
        {...props}
      />
    )
  },
)

export const PasswordStrengthMeter = React.forwardRef(
  function PasswordStrengthMeter(props, ref) {
    const { max = 4, value, ...rest } = props

    const percent = (value / max) * 100
    const { label, colorPalette } = getColorPalette(percent)

    return (
      <Stack align='flex-end' gap='1' ref={ref} {...rest}>
        <HStack width='full' ref={ref} {...rest}>
          {Array.from({ length: max }).map((_, index) => (
            <Box
              key={index}
              height='1'
              flex='1'
              rounded='sm'
              data-selected={index < value ? '' : undefined}
              layerStyle='fill.subtle'
              colorPalette='gray'
              _selected={{
                colorPalette,
                layerStyle: 'fill.solid',
              }}
            />
          ))}
        </HStack>
        {label && <HStack textStyle='xs'>{label}</HStack>}
      </Stack>
    )
  },
)

// 비밀번호 강도 계산 함수
function calculatePasswordStrength(password) {
  let strength = 0;

  // 비밀번호 길이 체크 (8자 이상이면 +20점)
  if (password.length >= 8) strength += 20;

  // 대소문자 포함 여부 체크 (대문자 + 소문자 사용 시 +20점)
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;

  // 숫자 포함 여부 체크 (숫자 사용 시 +20점)
  if (/\d/.test(password)) strength += 20;

  // 특수문자 포함 여부 체크 (특수문자 사용 시 +20점)
  if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

  // 비밀번호가 너무 간단한 패턴인 경우 강도 낮추기 (예: 123456)
  if (/123456|password|qwerty/.test(password)) strength -= 20;

  // 강도는 100을 넘을 수 없으므로 100을 넘지 않도록 제한
  return Math.min(strength, 100);
}

function getColorPalette(percent) {
  if (percent < 20) {
    return { label: 'Very Weak', colorPalette: 'red' };
  } else if (percent < 40) {
    return { label: 'Weak', colorPalette: 'orange' };
  } else if (percent < 60) {
    return { label: 'Moderate', colorPalette: 'yellow' };
  } else if (percent < 80) {
    return { label: 'Strong', colorPalette: 'blue' };
  } else {
    return { label: 'Very Strong', colorPalette: 'green' };
  }
}
