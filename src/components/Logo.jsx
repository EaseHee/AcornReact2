import { Box, Image } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

function Logo() {
    const navigate = useNavigate();

    const handleLogoClick = (e) => {
        if (window.location.pathname === "/") {
            // 메인 페이지에서 로고 클릭 시 새로고침
            window.location.reload();
        } else {
            // 다른 페이지에서는 메인 페이지로 이동
            navigate("/");
        }
    };

    return (
        <Box
            as="div"
            display="flex"
            alignItems="center"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
        >
            <Image src="/logo01.png" alt="forklog로고" />
            <Image src="/textlogo.png" alt="forklog로고" />
        </Box>
    );
}

export default Logo;
