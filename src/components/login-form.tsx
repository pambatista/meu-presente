'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Login data:', data);

      navigate.push('/app/meus-presentes');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="!text-2xl !font-bold !mb-0">Bem-vindo(a) de volta!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Insira seu email e senha para acessar sua conta.
          </p>
        </div>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Login'}
          </Button>
        </Field>
        <FieldSeparator></FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Ainda não tem uma conta?{' '}
            <a href="/register" className="underline underline-offset-4">
              Cadastre-se
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
