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

const Terms2 = () => {
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
          개인 정보 보호 정책
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>개인 정보 보호 정책</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>
          <h2>제 1 조 (목적)</h2>
          <p>
            이 정책은 [회사명] (이하 "회사")가 수집하는 개인 정보의 이용 목적 및
            관리 방침을 설명합니다.
          </p>
          <br />
          <h2>제 2 조 (수집하는 개인 정보)</h2>
          <p>회사는 다음과 같은 정보를 수집합니다:</p>
          <ul>
            <li>
              <strong>회원 가입 시</strong>: 이름, 이메일 주소, 전화번호,
              비밀번호 등
            </li>
            <li>
              <strong>서비스 이용 시</strong>: IP 주소, 쿠키, 서비스 이용 기록
              등
            </li>
          </ul>
          <br />
          <h2>제 3 조 (개인 정보의 이용 목적)</h2>
          <p>회사는 수집한 개인 정보를 다음의 목적으로 이용합니다:</p>
          <ol>
            <li>서비스 제공 및 운영</li>
            <li>고객 문의 및 서비스 개선</li>
            <li>마케팅 및 프로모션 정보 제공</li>
          </ol>
          <br />
          <h2>제 4 조 (개인 정보의 보유 및 이용 기간)</h2>
          <p>
            회사는 개인 정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를
            지체 없이 파기합니다. 단, 법률에 의해 보존해야 하는 경우에는 해당
            기간 동안 보관합니다.
          </p>
          <br />
          <h2>제 5 조 (개인 정보의 제3자 제공)</h2>
          <p>
            회사는 이용자의 동의 없이 개인 정보를 제3자에게 제공하지 않습니다.
            단, 법률에 의해 요구되는 경우에는 예외로 합니다.
          </p>
          <br />
          <h2>제 6 조 (개인 정보의 안전성 확보 조치)</h2>
          <p>
            회사는 개인 정보의 안전성을 확보하기 위해 다음과 같은 조치를
            취합니다:
          </p>
          <ul>
            <li>해킹 등에 대비한 기술적 대책</li>
            <li>개인 정보 취급 직원의 관리 및 교육</li>
          </ul>
          <br />
          <h2>제 7 조 (이용자의 권리)</h2>
          <p>
            이용자는 언제든지 자신의 개인 정보를 조회, 수정, 삭제할 수 있으며,
            이의를 제기할 권리가 있습니다.
          </p>
          <br />
          <h2>제 8 조 (개인 정보 보호 정책의 변경)</h2>
          <p>
            회사는 본 정책을 변경할 수 있으며, 변경된 내용은 서비스 내에
            공지합니다.
          </p>
          <br />
          <h2>부칙</h2>
          <p>이 정책은 [날짜]부터 시행됩니다.</p>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default Terms2;
