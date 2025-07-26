"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SignaturePad } from "@/components/signature-pad";
import { Textarea } from "@/components/ui/Textarea";
import { sign } from "@/lib/actions/sign";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Define the character limit
const MAX_CHARS = 100;

export default function SignDialog({ user }: { user: User }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [localSignature, setLocalSignature] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Add state to track the message input
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    if (!formData.get("message") || (formData.get("message") as string).trim().length === 0) {
      toast.error("Please enter a message.");
      return;
    }

    formData.append("signature", localSignature);

    startTransition(async () => {
      try {
        await sign(formData);
        router.refresh(); 
        toast.success("Thank you for signing!");
        setMessage(""); // Clear the message field on success
        setIsOpen(false);
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Sign Guestbook</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sign my guestbook</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user?.name ?? "Anonymous"}
                readOnly
                className="font-semibold"
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Leave a message</Label>
              <Textarea 
                id="message" 
                name="message" 
                required 
                maxLength={MAX_CHARS} // Enforce the limit
                value={message} // Control the component with state
                onChange={(e) => setMessage(e.target.value)} // Update state on change
              />
              {/* Add the character counter below the textarea */}
              <div className="text-right text-xs text-muted-foreground">
                {message.length} / {MAX_CHARS}
              </div>
            </div>
            <div className="grid w-full gap-1.5">
              <Label>Draw your signature</Label>
              <SignaturePad
                className={cn(
                  "aspect-video h-40 w-full rounded-lg border",
                  "border-input bg-background dark:bg-zinc-900"
                )}
                onChange={(value) => setLocalSignature(value ?? "")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Signing..." : "Sign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}