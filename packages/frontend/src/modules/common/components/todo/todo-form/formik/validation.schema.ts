import * as Yup from 'yup';

export const TodoSchema = Yup.object().shape({
  title: Yup.string().min(4, 'Too Short!').max(20, 'Too Long!').required('Required'),
  description: Yup.string().min(4, 'Too Short!').max(500, 'Too Long!').required('Required')
});
