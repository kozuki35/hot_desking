import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface Props {
  buttonRef: React.RefObject<HTMLButtonElement>;
  triggerDataRefresh: () => void;
}

const DeskAddDialog = (props: Props) => {
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCode('');
    setName('');
    setLocation('');
    setStatus('');
    setDescription('');
  }, [isOpen]);

  const handleAddDesk = async () => {
    // Validate required fields
    if (!code || !name || !location || !status) {
      toast.error('Please fill in all required fields (Code, Name, Location, Status)');
      return;
    }

    try {
      // Submit desk information to backend
      const response = await axiosInstance.post(`/desks`, {
        code: code,
        name: name,
        location: location,
        status: status,
        description: description,
      });

      // Handle success response
      if (response.status === 201) {
        toast.success(`Desk: ${response.data.desk.code} added successfully`);
        props.buttonRef.current ? props.buttonRef.current.click() : '';
        props.triggerDataRefresh();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle errors from backend
        if (
          error.response?.status === 400 &&
          error.response?.data.message === 'Desk code already exists. Please choose a different code.'
        ) {
          toast.error('Desk code already exists. Please choose a different code.');
        } else {
          toast.error(error.response?.data.message || `Error adding Desk: ${code}`);
        }
      } else {
        toast.error(`Error adding Desk: ${code}`);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button ref={props.buttonRef} variant="outline" className="invisible">
          Add Desk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Desk</DialogTitle>
          <DialogDescription>Make changes to your desk here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input id="code" value={code} className="col-span-3" onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              className="col-span-3"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="col-span-3">
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddDesk}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeskAddDialog;
