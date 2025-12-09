"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createMessageSchema,
  CreateMessageSchemaType,
} from "@/app/schemas/message";
import MessageComposer from "./MessageComposer";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { Message } from "@/lib/generated/prisma/client";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "@/lib/get-avatar";
import { useChannelRealtime } from "@/providers/ChannelRealtimeProvider";

interface MessageInputProps {
  channelId: string;
  user: KindeUser<Record<string, unknown>>;
}

type MessagePage = { items: Message[]; nextCursor?: string };
type InfiniteMessages = InfiniteData<MessagePage>;

const MessageInputForm = ({ channelId, user }: MessageInputProps) => {
  const queryClient = useQueryClient();
  const [editorKey, setEditorKey] = useState(0);
  const upload = useAttachmentUpload();
  const { send } = useChannelRealtime();

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      channelId: channelId,
      content: "",
    },
  });

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: ["message.list", channelId],
        });
        const previousData = queryClient.getQueryData<InfiniteMessages>([
          "message.list",
          channelId,
        ]);

        const tempId = `optimistic-${crypto.randomUUID()}`;

        const optimisticMessage: Message = {
          id: tempId,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id,
          authorEmail: user.email!,
          authorName: user.given_name ?? "John Doe",
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: channelId,
          threadId: null,
        };

        queryClient.setQueryData<InfiniteMessages>(
          ["message.list", channelId],
          (old) => {
            if (!old) {
              return {
                pages: [
                  {
                    items: [optimisticMessage],
                    nextCursor: undefined,
                  },
                ],
                pageParams: [undefined],
              } satisfies InfiniteMessages;
            }

            const firstPage = old.pages[0] ?? {
              items: [],
              nextCursor: undefined,
            };

            const updatedFirstPage: MessagePage = {
              ...firstPage,
              items: [optimisticMessage, ...firstPage.items],
            };

            return {
              ...old,
              pages: [updatedFirstPage, ...old.pages.slice(1)],
            };
          }
        );

        return {
          previousData,
          tempId,
        };
      },

      onSuccess: (data, _variables, context) => {
        queryClient.setQueryData<InfiniteMessages>(
          ["message.list", channelId],
          (old) => {
            if (!old) return old;

            const updatedPages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((m) =>
                m.id === context.tempId ? { ...data } : m
              ),
            }));

            return { ...old, pages: updatedPages };
          }
        );

        form.reset({ channelId, content: "" });
        upload.clear();

        setEditorKey((k) => k + 1);

        send({ type: "message:created", payload: { message: data } });

        return toast.success("Message Created Successfully");
      },
      onError: (_err, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            ["message.list", channelId],
            context.previousData
          );
        }

        return toast.error("Something went wrong");
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
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <MessageComposer
                    key={editorKey}
                    value={field.value}
                    onChange={field.onChange}
                    onSubmit={() => onSubmit(form.getValues())}
                    isSubmitting={createMessageMutation.isPending}
                    upload={upload}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm px-1" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default MessageInputForm;