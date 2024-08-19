import { Button } from '@/components/ui/button';
import { FC } from 'react';

const DeskSelection: FC = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Desk Selection</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">All Desks</h3>
          <p className="text-sm text-muted-foreground">You can choose a desk you prefer.</p>
          <Button className="mt-4">Select</Button>
        </div>
      </div>
    </main>
  );
};

export default DeskSelection;