import { Input, Stack } from "@chakra-ui/react"
import { Button } from "../../components/ui/button"
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger,} from "../../components/ui/dialog"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Field } from "../../components/ui/field"
import { useRef } from "react"

const CategoryDialog = () => {
  const ref = useRef(null)
  return (
    <DialogRoot initialFocusEl={() => ref.current}>
      <DialogTrigger asChild>
        <Button variant="outline"><FaMagnifyingGlass/>한식</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Header</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            <Field label="First Name">
              <Input placeholder="First Name" />
            </Field>
            <Field label="Last Name">
              <Input ref={ref} placeholder="Focus First" />
            </Field>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">닫기</Button>
          </DialogActionTrigger>
          <Button>적용</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
};
export default CategoryDialog;