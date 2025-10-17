import { AuthLayout } from '@/components/auth-layout';
import { RegisterForm } from '@/components/register-form';
import { PublicRoute } from '@/components/PublicRoute';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </PublicRoute>
  );
}
