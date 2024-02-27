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
import { useNavigate } from 'react-router';

import { ResetPasswordData } from '../../../types/auth/auth.types';
import { resetSchema } from './validation.schema';
import authService from '../auth.service';
import { showErrorToast, showErrorToastWithText, showInfoToast } from '../../form.toasts';
import { ROUTER_KEYS } from '../../../consts/app-keys.const';

/* eslint-disable */

export const FormikResetForm = () => {
  const { mutate: resetMutation } = useMutation((formPayload: ResetPasswordData) =>
    authService.resetPass(formPayload)
  );
  const toast = useToast();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(document.location.search);

  const formik = useFormik<ResetPasswordData>({
    initialValues: {
      userId: Number(searchParams.get('id')),
      token: searchParams.get('token') || '',
      password: ''
    },
    validationSchema: resetSchema,
    onSubmit: (values: ResetPasswordData) =>
      resetMutation(values, {
        onSuccess: () => {
          navigate(ROUTER_KEYS.AUTH.LOGIN);
          showInfoToast(toast, 'Password changed');
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
              Write new password
            </Heading>
            <FormControl isInvalid={!!formik.errors.password && formik.touched.password}>
              <FormLabel htmlFor="password">New password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="purple" width="fit-content" alignSelf={'center'}>
              Reset
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};
