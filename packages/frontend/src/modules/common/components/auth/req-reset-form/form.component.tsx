import React from 'react';
import { useFormik } from 'formik';
import {
  VStack,
  FormControl,
  Input,
  Button,
  Box,
  FormErrorMessage,
  Flex,
  FormLabel,
  Heading,
  useToast
} from '@chakra-ui/react';
import { isMobile, isMobileOnly } from 'react-device-detect';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';

import { ReqResetPasswordData } from '../../../types/auth/auth.types';
import { reqResetSchema } from './validation.schema';
import authService from '../auth.service';
import { showErrorToast, showErrorToastWithText, showInfoToast } from '../../form.toasts';

/* eslint-disable */

export const FormikReqResetForm = () => {
  const { mutate: reqResetMutation } = useMutation((formPayload: ReqResetPasswordData) =>
    authService.reqResetPass(formPayload)
  );

  const toast = useToast();

  const formik = useFormik<ReqResetPasswordData>({
    initialValues: { email: '' },
    validationSchema: reqResetSchema,
    onSubmit: (values: ReqResetPasswordData) =>
      reqResetMutation(values, {
        onSuccess: () => {
          showInfoToast(toast, 'Email sent');
        },
        onError: (error) => {
          if (error instanceof AxiosError)
            showErrorToastWithText(toast, error.response?.data.error);
          else showErrorToast(toast);
        }
      })
  });

  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md" w={isMobileOnly ? '100%' : isMobile ? '75%' : '25%'}>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="flex-start">
            <Heading size={'md'} color="purple" textTransform={'uppercase'}>
              Reset password
            </Heading>
            <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="purple" width="fit-content" alignSelf={'center'}>
              Send mail with reset-link
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};
