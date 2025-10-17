import { AuthLayout } from '@/components/auth-layout';
import { LoginForm } from '@/components/login-form';
import { PublicRoute } from '@/components/PublicRoute';

export default function LoginPage() {
  return (
    <PublicRoute>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </PublicRoute>
  );
}
