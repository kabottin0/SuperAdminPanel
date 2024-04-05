import { Stack, Typography } from "@mui/material";

import RootStyled from "./styled";
export default function MainLayout() {
 

  return (
    <RootStyled>
      <Stack flex={1} width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
      <Typography variant="h1">Online</Typography>
      </Stack>
    </RootStyled>
  );
}
