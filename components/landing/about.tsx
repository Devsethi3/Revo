"use client";

import { motion } from "motion/react";
import {
  MessageSquare,
  Hash,
  MessageCircle,
  Smile,
  UserPlus,
  Users,
  Bell,
  AtSign,
  Send,
  Check,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Real-time Messaging",
    description:
      "Instantly connect with your team. Messages sync across all devices in milliseconds, keeping everyone on the same page.",
    icon: MessageSquare,
    className: "md:col-span-2 md:row-span-2",
    size: "large",
  },
  {
    title: "Organized Channels",
    description:
      "Create public or private channels for teams, projects, or topics.",
    icon: Hash,
    className: "md:col-span-1",
    size: "small",
  },
  {
    title: "Threaded Replies",
    description:
      "Keep discussions focused with dedicated conversation threads.",
    icon: MessageCircle,
    className: "md:col-span-1",
    size: "small",
  },
  {
    title: "Reactions & Emoji",
    description:
      "Express yourself instantly. React to messages with emoji to acknowledge, agree, or celebrate without cluttering the chat.",
    icon: Smile,
    className: "md:col-span-2",
    size: "medium",
  },
  {
    title: "Invite Members",
    description: "Easily add teammates with a simple invite link or email.",
    icon: UserPlus,
    className: "md:col-span-1",
    size: "small",
  },
  {
    title: "Team Presence",
    description: "See who's online and available in real-time.",
    icon: Users,
    className: "md:col-span-1",
    size: "small",
  },
  {
    title: "Smart Mentions",
    description: "Tag teammates to get their attention when it matters.",
    icon: AtSign,
    className: "md:col-span-1",
    size: "small",
  },
  {
    title: "Instant Notifications",
    description: "Never miss important updates from your team.",
    icon: Bell,
    className: "md:col-span-1",
    size: "small",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

// Mini chat preview for the large card
const ChatPreview = () => (
  <div className="mt-6 space-y-3 rounded-xl border border-border bg-background/50 p-4">
    {[
      {
        user: "S",
        name: "Sarah",
        msg: "Just shipped the new feature! 🚀",
        time: "2:34 PM",
        read: true,
      },
      {
        user: "A",
        name: "Alex",
        msg: "Nice work! Testing it now",
        time: "2:35 PM",
        read: true,
      },
      {
        user: "J",
        name: "Jordan",
        msg: "Looks great ✨",
        time: "2:36 PM",
        read: false,
      },
    ].map((message, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + idx * 0.1 }}
        className="flex items-start gap-3"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
          {message.user}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {message.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.time}
            </span>
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {message.msg}
          </p>
        </div>
        {message.read ? (
          <CheckCheck className="h-4 w-4 shrink-0 text-primary" />
        ) : (
          <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </motion.div>
    ))}
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <span className="flex-1 text-sm text-muted-foreground">
        Message #general
      </span>
      <Send className="h-4 w-4 text-muted-foreground" />
    </div>
  </div>
);

// Channel list preview for channels card
const ChannelPreview = () => (
  <div className="mt-3 space-y-1.5">
    {[
      { name: "general", unread: 3 },
      { name: "engineering", unread: 0 },
      { name: "design", unread: 5 },
    ].map((channel, idx) => (
      <motion.div
        key={channel.name}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + idx * 0.05 }}
        className={cn(
          "flex items-center justify-between rounded-md px-2 py-1 text-xs",
          idx === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-1.5">
          <Hash className="h-3 w-3" />
          <span>{channel.name}</span>
        </div>
        {channel.unread > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {channel.unread}
          </span>
        )}
      </motion.div>
    ))}
  </div>
);

// Thread preview
const ThreadPreview = () => (
  <div className="mt-3 rounded-lg border-l-2 border-primary/30 bg-muted/30 py-2 pl-3 pr-2">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <MessageCircle className="h-3 w-3" />
      <span>3 replies</span>
      <span className="text-muted-foreground/50">•</span>
      <span>Last reply 2m ago</span>
    </div>
  </div>
);

// Reactions preview
const ReactionsPreview = () => (
  <div className="mt-4 flex flex-wrap gap-2">
    {[
      { emoji: "👍", count: 5 },
      { emoji: "🎉", count: 3 },
      { emoji: "❤️", count: 2 },
      { emoji: "🚀", count: 4 },
    ].map((reaction, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + idx * 0.05 }}
        className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-sm"
      >
        <span>{reaction.emoji}</span>
        <span className="text-xs text-muted-foreground">{reaction.count}</span>
      </motion.div>
    ))}
    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
      <Smile className="h-3.5 w-3.5" />
    </div>
  </div>
);

// Team members preview
const MembersPreview = () => (
  <div className="mt-3 flex items-center">
    <div className="flex -space-x-2">
      {["S", "A", "J", "M"].map((initial, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + idx * 0.05 }}
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground"
        >
          {initial}
        </motion.div>
      ))}
    </div>
    <div className="ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-xs text-muted-foreground">
      +5
    </div>
  </div>
);

// Online status preview
const PresencePreview = () => (
  <div className="mt-3 flex items-center gap-3">
    {[
      { status: "online", count: 8 },
      { status: "away", count: 3 },
      { status: "offline", count: 2 },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            item.status === "online" && "bg-emerald-500",
            item.status === "away" && "bg-amber-500",
            item.status === "offline" && "bg-muted-foreground/30"
          )}
        />
        <span>{item.count}</span>
      </div>
    ))}
  </div>
);

export default function AboutSection() {
  return (
    <section className="relative py-24 md:py-32" id="about">
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-medium uppercase tracking-wider text-primary"
          >
            About
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Everything your team needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-muted-foreground"
          >
            Real-time messaging, organized channels, threaded conversations, and
            seamless collaboration — all in one place.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.size === "large";
            const isMedium = feature.size === "medium";

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
                  feature.className,
                  isLarge && "p-8"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-2.5 text-primary",
                    isLarge && "mb-5 p-3"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isLarge && "h-6 w-6")} />
                </div>

                {/* Content */}
                <h3
                  className={cn(
                    "mb-2 font-semibold text-foreground",
                    isLarge && "mb-3 text-xl",
                    isMedium && "text-lg"
                  )}
                >
                  {feature.title}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed text-muted-foreground",
                    isLarge && "text-base"
                  )}
                >
                  {feature.description}
                </p>

                {/* Feature-specific previews */}
                {feature.title === "Real-time Messaging" && <ChatPreview />}
                {feature.title === "Organized Channels" && <ChannelPreview />}
                {feature.title === "Threaded Replies" && <ThreadPreview />}
                {feature.title === "Reactions & Emoji" && <ReactionsPreview />}
                {feature.title === "Invite Members" && <MembersPreview />}
                {feature.title === "Team Presence" && <PresencePreview />}

                {/* Subtle hover glow */}
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
