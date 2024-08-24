import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabsMenuProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TabsMenu = ({ activeTab, onTabChange }: TabsMenuProps) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="archived" className="hidden sm:flex">
          Archived
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabsMenu;
