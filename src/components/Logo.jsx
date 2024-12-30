import { MdCategory } from "react-icons/md";
import {Box, Text} from "@chakra-ui/react";
import {Link} from "react-router-dom";

function Logo() {
    return (
        <Box as={Link} to="/" display={"flex"} alignItems="center">
            <MdCategory style={{ fontSize: '36px' }} />
            <Text>Private</Text>
        </Box>
    );
}

export default Logo;