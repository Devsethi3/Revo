"use client";

import {
  createMessageSchema,
  CreateMessageSchemaType,
} from "@/app/schemas/message";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import MessageComposer from "../message/MessageComposer";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";

interface ThreadReplyFormProps {
  threadId: string;
}

const ThreadReplyForm = ({ threadId }: ThreadReplyFormProps) => {
  const { channelId } = useParams<{ channelId: string }>();
  const upload = useAttachmentUpload();
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      channelId: channelId,
      threadId: threadId,
    },
  });

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onSuccess: () => {
        form.reset({ channelId, content: "", threadId });
        upload.clear();
        setEditorKey((k) => k + 1);
        toast.success("thread created");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    })
  );

  function onSubmit(data: CreateMessageSchemaType) {
    createMessageMutation.mutate({
      ...data,
      imageUrl: upload.stagedUrl ?? undefined,
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormControl>
                <MessageComposer
                  value={field.value}
                  onChange={field.onChange}
                  upload={upload}
                  key={editorKey}
                  onSubmit={() => onSubmit(form.getValues())}
                />
              </FormControl>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default ThreadReplyForm;
