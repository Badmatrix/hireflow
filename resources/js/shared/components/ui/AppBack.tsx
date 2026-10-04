import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react'
import AppButton from './AppButton';

type Props = {
    href: string
    to:string
}

export default function AppBack({to,href}:Props) {
  return (
      <Link
          href={href}
          style={{
              textDecoration: 'none',
              width: 'fit-content',
          }}
      >
          <AppButton variant="subtle" leftSection={<ArrowLeft size={16} />}>
              Back to {to}
          </AppButton>
      </Link>
  );
}
