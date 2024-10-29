import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../redux/adminSlice';
import { useGetAdminCredentialsQuery } from '../../../../redux/adminApi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/custom/button';
import { PasswordInput } from '../../../components/custom/password-input';
import { cn } from '../../../lib/utils';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
});

export function UserAuthForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check for access token on component mount
  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      // Redirect to dashboard if token exists
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Skip initial query with `skip: true`
  const { data: response, error } = useGetAdminCredentialsQuery(credentials, { skip: !credentials });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (response) {
      const { accessToken, refreshToken } = response;

      Cookies.set('accessToken', accessToken, { expires: 0.02 }); // Set cookie for 30 seconds
      Cookies.set('refreshToken', refreshToken, { expires: 1 / 24 }); // Set cookie for 1 hour

      dispatch(loginSuccess({ email: credentials.email }));

      navigate('/admin/dashboard');
    } else if (error) {
      console.error('Authentication error:', error);
      alert(error?.message || 'Invalid email or password');
    }
    setIsLoading(false);
  }, [response, error, credentials, dispatch, navigate]);

  async function onSubmit(data) {
    setIsLoading(true);
    setCredentials(data);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2 w-full' loading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
