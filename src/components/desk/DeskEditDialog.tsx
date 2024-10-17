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
import { Desk } from '../../pages/Desk/DeskManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface Props {
  buttonRef: React.RefObject<HTMLButtonElement>;
  desk?: Desk;
  triggerDataRefresh: () => void;
}

const DeskEditDialog = (props: Props) => {
  // State variables for form fields
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // Populate the form fields with the current desk data
  useEffect(() => {
    setName(props.desk?.name || '');
    setLocation(props.desk?.location || '');
    setStatus(props.desk?.status || '');
    setDescription(props.desk?.description || '');
  }, [props, isOpen]);

  // Handle desk update
  const handleUpdate = async () => {
    // Validate required fields
    if (!name || !location || !status) {
      toast.error('Please fill in all required fields (Name, Location, Status)');
      return;
    }

    try {
      // Send a put request to update the desk
      const response = await axiosInstance.put(`/desks/${props.desk?._id}`, {
        name: name,
        location: location,
        status: status,
        description: description,
      });

      if (response.status === 200) {
        toast.success(`Desk: ${props.desk?.code} updated successfully`);
        props.buttonRef.current ? props.buttonRef.current.click() : '';
        props.triggerDataRefresh();
      }
    } catch (error) {
      console.error(`Error updating Desk: ${props.desk?.code}:`, error);
      // Handle error from backend
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error || `Error updating Desk: ${props.desk?.code}`);
      } else {
        toast.error(`Error updating Desk: ${props.desk?.code}`);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button ref={props.buttonRef} variant="outline" className="invisible">
          Edit Desk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Desk: {props.desk?.code}</DialogTitle>
          <DialogDescription>Make changes to your desk here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <Button type="submit" onClick={() => handleUpdate()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeskEditDialog;
