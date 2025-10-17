'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { User } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="!text-xl !font-bold !m-0">Meu Perfil</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie suas informações pessoais
          </p>
        </div>

        {/* Card de Perfil */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary/10 text-primary flex size-20 items-center justify-center rounded-full">
              <User className="size-10" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">João Silva</h2>
              <p className="text-muted-foreground">joao@example.com</p>
            </div>
          </div>

          <form className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input id="name" type="text" defaultValue="João Silva" />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  defaultValue="joao@example.com"
                />
              </Field>
              <Field>
                <Button type="submit">Salvar Alterações</Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}
