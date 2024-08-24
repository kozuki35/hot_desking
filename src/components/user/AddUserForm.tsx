import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AddUserFormProps = {
  newFirstName: string;
  newLastName: string;
  newEmail: string;
  newPassword: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onAddUser: () => void;
  onCancel: () => void;
};

const AddUserForm = ({
  newFirstName,
  newLastName,
  newEmail,
  newPassword,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onAddUser,
  onCancel,
}: AddUserFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="new-first-name"
          placeholder="First Name"
          value={newFirstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
        />
        <Input
          id="new-last-name"
          placeholder="Last Name"
          value={newLastName}
          onChange={(e) => onLastNameChange(e.target.value)}
        />
        <Input
          id="new-email"
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <Input
          id="new-password"
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <Button onClick={onCancel}>Back to User List</Button>
        <Button onClick={onAddUser}>Create User</Button>
      </div>
    </div>
  );
};

export default AddUserForm;
