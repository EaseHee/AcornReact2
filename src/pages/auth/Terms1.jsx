import { Button } from "../../components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const Terms1 = () => {
  return (
    <DialogRoot scrollBehavior="inside" size="sm">
      <DialogTrigger asChild>
        <Button
          variant="link"
          fontSize="sm"
          p={0}
          minW="unset"
          color="orange.500"
        >
          서비스 이용 약관
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>서비스 이용 약관</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>
          <h2>제 1 조 (목적)</h2>
          <p>
            이 약관은 [서비스명] (이하 "서비스")의 이용에 관한 조건 및 절차,
            회원의 권리와 의무, 책임 사항 등을 규정함을 목적으로 합니다.
          </p>
          <br />
          <h2>제 2 조 (정의)</h2>
          <ol>
            <li>
              <strong>서비스</strong>란 [서비스의 구체적인 설명]을 의미합니다.
            </li>
            <li>
              <strong>이용자</strong>란 본 약관에 동의하고 서비스를 이용하는
              모든 개인 및 법인입니다.
            </li>
            <li>
              <strong>회원</strong>은 서비스에 가입하여 회원 ID를 부여받은
              이용자를 의미합니다.
            </li>
          </ol>
          <br />
          <h2>제 3 조 (약관의 효력 및 변경)</h2>
          <p>본 약관은 서비스에 공지함으로써 효력을 발생합니다.</p>
          <p>
            회사는 필요에 따라 본 약관을 변경할 수 있으며, 변경된 내용은 서비스
            내에 공지합니다.
          </p>
          <br />
          <h2>제 4 조 (회원가입)</h2>
          <p>이용자는 서비스 이용을 위해 회원가입을 해야 합니다.</p>
          <p>
            회원가입 시 제공하는 정보는 정확하고 최신의 정보를 입력해야 하며,
            허위 정보로 인한 모든 책임은 회원에게 있습니다.
          </p>
          <br />
          <h2>제 5 조 (서비스 이용)</h2>
          <p>
            회원은 서비스를 법률 및 사회적 규범에 위배되지 않게 이용해야 합니다.
          </p>
          <p>
            회사는 서비스의 이용을 중단하거나 제한할 수 있는 권리를 가집니다.
          </p>
          <br />
          <h2>제 6 조 (저작권)</h2>
          <p>
            서비스 내의 모든 콘텐츠는 저작권법에 의해 보호받으며, 이용자는 사전
            동의 없이 이를 복제, 배포, 전송할 수 없습니다.
          </p>
          <br />
          <h2>제 7 조 (면책 조항)</h2>
          <p>
            회사는 천재지변, 불가항력적인 사유로 인해 서비스를 제공할 수 없는
            경우 책임을 지지 않습니다.
          </p>
          <br />
          <h2>제 8 조 (분쟁 해결)</h2>
          <p>
            본 약관과 관련된 분쟁에 대해서는 [관할 법원]을 제1심 법원으로
            합니다.
          </p>
          <br />
          <h2>부칙</h2>
          <p>이 약관은 [날짜]부터 시행됩니다.</p>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default Terms1;
