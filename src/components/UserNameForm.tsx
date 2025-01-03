import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UserNameFormProps {
  onSubmit: (name: string) => void;
}

export const UserNameForm = ({ onSubmit }: UserNameFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">Welcome!</h2>
        <p className="text-gray-500 text-center">Please enter your name to continue</p>
      </div>
      <Input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
      />
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};