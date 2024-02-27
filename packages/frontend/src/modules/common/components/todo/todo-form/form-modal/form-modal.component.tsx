import React from 'react';
import {
  ModalProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';

import { FormikForm } from '../formik';
import { ITodo } from '../../../../types/todo/todo.types';

interface FormModalProps extends Omit<ModalProps, 'children'> {
  formType: 'ADD' | 'UPDATE';
  initialState?: ITodo;
}

export const FormModal = ({ isOpen, onClose, formType, initialState }: FormModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        {formType === 'ADD' ? 'New Todo' : formType === 'UPDATE' ? 'Update todo' : ''}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormikForm type={formType} onClose={onClose} initialState={initialState} />
      </ModalBody>
      <ModalFooter />
    </ModalContent>
  </Modal>
);
