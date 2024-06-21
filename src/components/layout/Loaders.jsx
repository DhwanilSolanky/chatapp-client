import { Box, Stack } from '@mui/material'
import React from 'react'
import { BouncingSkeleton } from '../styles/StyledComponents'

const Loaders = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <Stack spacing="1rem" alignItems="center">
        <BouncingSkeleton variant="rectangular" width={210} height={118} />
        <BouncingSkeleton variant="text" width={210} />
        <BouncingSkeleton variant="text" width={210} />
        <TypingLoader />
      </Stack>
    </Box>
  )
}


const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton variant="circular" width={15} height={15} style={{ animationDelay: "0.1s" }} />
      <BouncingSkeleton variant="circular" width={15} height={15} style={{ animationDelay: "0.2s" }} />
      <BouncingSkeleton variant="circular" width={15} height={15} style={{ animationDelay: "0.4s" }} />
      <BouncingSkeleton variant="circular" width={15} height={15} style={{ animationDelay: "0.6s" }} />
    </Stack>
  )
}

export {
  TypingLoader,
  Loaders
}
