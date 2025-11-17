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

const ThreadReplyForm = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const upload = useAttachmentUpload();
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      channelId: channelId,
    },
  });

  function onSubmit(data: CreateMessageSchemaType) {
    console.log(data);
  }

  return (
    <>
      <Form {...form}>
        <form>
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
