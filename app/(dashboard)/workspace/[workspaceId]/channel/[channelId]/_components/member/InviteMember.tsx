import {
  inviteMemberSchema,
  InviteMemberSchemaType,
} from "@/app/schemas/member";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const InviteMember = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<InviteMemberSchemaType>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const inviteMutation = useMutation(
    orpc.workspace.member.invite.mutationOptions({
      onSuccess: () => {
        toast.success("Invitation sent successfully");
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        // Format error message for user-friendly display
        let errorMessage = "Failed to send invitation. Please try again.";

        if (error.message) {
          // Handle common error patterns
          if (
            error.message.includes("already exists") ||
            error.message.includes("already a member")
          ) {
            errorMessage = "This user is already a member of the workspace.";
          } else if (
            error.message.includes("invalid email") ||
            error.message.includes("email")
          ) {
            errorMessage = "Please provide a valid email address.";
          } else if (
            error.message.includes("permission") ||
            error.message.includes("unauthorized")
          ) {
            errorMessage = "You don't have permission to invite members.";
          } else if (
            error.message.includes("limit") ||
            error.message.includes("maximum")
          ) {
            errorMessage = "Member limit reached. Please upgrade your plan.";
          } else if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            errorMessage = "Network error. Please check your connection.";
          } else {
            // Use the error message if it's user-friendly (short and clear)
            errorMessage =
              error.message.length < 100 ? error.message : errorMessage;
          }
        }

        toast.error(errorMessage, {
          duration: 4000,
        });
      },
    })
  );

  const isLoading = inviteMutation.isPending;

  function onSubmit(values: InviteMemberSchemaType) {
    inviteMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a new member to your workspace by using their email
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Email"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <UserPlus />
                  Send Invitation
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMember;
