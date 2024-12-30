import { Fieldset, Stack, Textarea} from '@chakra-ui/react';
import { Field } from "../../../../components/ui/field"
import { NativeSelectField, NativeSelectRoot } from "../../../../components/ui/native-select"
import { useEffect } from 'react';
export default function FormData({ memberNo,eateryNo, onChange }) {
  useEffect(() => {
    // 초기값 전달
    onChange({
      memberNo,
      eateryNo,
    });
  }, [memberNo, eateryNo, onChange]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  return (
    <>    
    <Fieldset.Root size="lg" maxW="md">
      <Stack>
        <Fieldset.Legend>리뷰 등록하기</Fieldset.Legend>
        <Fieldset.HelperText>
          가게에 대한 솔직한 평을 남겨주세요.
        </Fieldset.HelperText>
      </Stack>

      <Fieldset.Content>
        <Field label="별점">
          <NativeSelectRoot>
            <NativeSelectField name="rating" onChange={handleInputChange}>
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
              <option value="0">☆☆☆☆☆</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Field>
        <Field label="내용">
          <Textarea name='content' onChange={handleInputChange} />
        </Field>
      </Fieldset.Content>
      </Fieldset.Root>
    </>
  );
}