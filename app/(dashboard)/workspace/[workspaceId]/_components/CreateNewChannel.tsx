// CreateNewChannel.tsx
"use client";

import {
  ChannelNameSchema,
  ChannelSchemaNameType,
  transformChannelName,
} from "@/app/schemas/channel";
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
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateNewChannel = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { workspaceId } = useParams<{ workspaceId: string }>();

  const form = useForm({
    resolver: zodResolver(ChannelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const createChannelMutation = useMutation(
    orpc.channel.create.mutationOptions({
      onSuccess: (newChannel) => {
        toast.success(`Channel ${newChannel.name} created successfully!`);
        queryClient.invalidateQueries({
          queryKey: orpc.channel.list.queryKey(),
        });

        form.reset();
        setOpen(false);

        router.push(`/workspace/${workspaceId}/channel/${newChannel.id}`);
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(`Error: ${error.message}`);
          return;
        }
        toast.error("An unexpected error occurred. Please try again.");
      },
    })
  );

  function onSubmit(values: ChannelSchemaNameType) {
    createChannelMutation.mutate(values);
  }

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="size-4" />
            Add Channel
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
            <DialogDescription>
              Create new channel to get started!
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
                      <Input placeholder="My Channel..." {...field} />
                    </FormControl>
                    {transformedName && transformedName !== watchedName && (
                      <p>
                        Will be creates as:{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          {transformedName}
                        </code>
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={createChannelMutation.isPending} type="submit">
                {createChannelMutation.isPending ? (
                  <>
                    {" "}
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                    Creating...{" "}
                  </>
                ) : (
                  "Create Channel"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNewChannel;
