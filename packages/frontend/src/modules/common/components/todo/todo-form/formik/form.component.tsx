import React from 'react';
import { useFormik } from 'formik';
import {
  VStack,
  FormControl,
  Input,
  Checkbox,
  Button,
  Box,
  Textarea,
  HStack,
  FormErrorMessage,
  AlertIcon,
  Alert,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Fade,
  useToast
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';

import { TodoSchema } from './validation.schema';
import todoService from '../../todo.service';
import { QUERY_KEYS } from '../../../../consts/app-keys.const';
import { showErrorToast, showErrorToastWithText, showInfoToast } from '../../../form.toasts';
import { ITodo } from '../../../../types/todo/todo.types';

export interface FormikFormProps {
  type: 'ADD' | 'UPDATE';
  onClose(): void;
  initialState?: ITodo;
}

export const FormikForm = ({ type, onClose, initialState }: FormikFormProps) => {
  const { mutate: createTodoMutation } = useMutation((formPayload: ITodo) =>
    todoService.createTodo(formPayload)
  );

  const { mutate: updateTodoMutation } = useMutation((formPayload: ITodo) =>
    todoService.updateTodo(formPayload)
  );

  const { mutate: deleteTodoMutation } = useMutation((formPayload: ITodo) =>
    todoService.deleteTodo(formPayload)
  );

  const queryClient = useQueryClient();
  const toast = useToast();

  const { isOpen: isVisibleSuccess, onOpen: successOnOpen } = useDisclosure();

  const sumbitFunc = {
    ADD: (values: ITodo) =>
      createTodoMutation(values, {
        onSuccess: () => {
          successOnOpen();
          queryClient.invalidateQueries(QUERY_KEYS.TODOS);
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.status === 401 ? 'UNAUTHORIZED' : error.message;

            showErrorToastWithText(toast, msg);
          } else showErrorToast(toast);
        }
      }),

    UPDATE: (values: ITodo) =>
      updateTodoMutation(values, {
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEYS.TODOS);
          onClose();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.status === 401 ? 'UNAUTHORIZED' : error.message;

            showErrorToastWithText(toast, msg);
          } else showErrorToast(toast);
        }
      }),

    DELETE: (values = {} as ITodo) => {
      deleteTodoMutation(values, {
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEYS.TODOS);
          showInfoToast(toast, 'TODO was deleted');
          onClose();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.status === 401 ? 'UNAUTHORIZED' : error.message;

            showErrorToastWithText(toast, msg);
          } else showErrorToast(toast);
        }
      });
    }
  };

  const formik = useFormik<ITodo>({
    initialValues: initialState || {
      title: '',
      description: '',
      completed: false,
      private: false
    },
    validationSchema: TodoSchema,
    onSubmit: sumbitFunc[type]
  });

  return (
    <div>
      <Box bg="white" rounded="md">
        {!isVisibleSuccess ? (
          <Fade in={!isVisibleSuccess}>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="center">
                <FormControl isInvalid={formik.touched.title && !!formik.errors.title}>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    placeholder="Title"
                  />
                  {formik.touched.title && <FormErrorMessage>Email is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={formik.touched.title && !!formik.errors.description}>
                  <Textarea
                    id="description"
                    name="description"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    placeholder="Description"
                  />
                  {formik.touched.title && (
                    <FormErrorMessage>Description is required.</FormErrorMessage>
                  )}
                </FormControl>
                <HStack width="80%" justifyContent="space-between" fontSize="x-large">
                  <Checkbox
                    id="completed"
                    name="completed"
                    onChange={formik.handleChange}
                    isChecked={formik.values.completed}
                    colorScheme="green"
                  >
                    Completed
                  </Checkbox>
                  <Checkbox
                    id="private"
                    name="private"
                    onChange={formik.handleChange}
                    isChecked={formik.values.private}
                    colorScheme="blue"
                  >
                    Private
                  </Checkbox>
                </HStack>
                <Button type="submit" colorScheme="purple" width="full">
                  {type}
                </Button>
                {type === 'UPDATE' && (
                  <Button
                    onClick={() => {
                      sumbitFunc.DELETE(initialState);
                    }}
                    colorScheme="red"
                    width="full"
                  >
                    DELETE
                  </Button>
                )}
              </VStack>
            </form>
          </Fade>
        ) : (
          <Fade in={isVisibleSuccess}>
            <Alert
              borderRadius=".5em"
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              minHeight="250px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                TODO submitted!
              </AlertTitle>
              <AlertDescription maxWidth="sm">Thanks for submitting your todo.</AlertDescription>
            </Alert>
          </Fade>
        )}
      </Box>
    </div>
  );
};
