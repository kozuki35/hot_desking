import { BaseLayout } from '@/components/layout/BaseLayout';
import DeskSelection from '../DeskSelection/DeskSelection';
import { FC } from 'react';

export const Dashboard: FC = () => {
  return (
    <BaseLayout>
      <DeskSelection />
    </BaseLayout>
  );
};
