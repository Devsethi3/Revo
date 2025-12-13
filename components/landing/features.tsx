"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Hash,
  UserPlus,
  MessageSquare,
  MessagesSquare,
  Smile,
  Send,
  Plus,
  AtSign,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Create a Channel",
    description: "Start by creating a space for your team to collaborate",
    icon: Hash,
  },
  {
    id: 2,
    title: "Invite Your Team",
    description: "Bring your teammates together in one place",
    icon: UserPlus,
  },
  {
    id: 3,
    title: "Start Conversations",
    description: "Send messages, share ideas, and stay connected",
    icon: MessageSquare,
  },
  {
    id: 4,
    title: "Discuss in Threads",
    description: "Keep detailed discussions organized with threads",
    icon: MessagesSquare,
  },
  {
    id: 5,
    title: "React & Engage",
    description: "Use reactions to quickly respond and engage",
    icon: Smile,
  },
];

// Animated mockups for each step
function StepOneMockup() {
  const [showModal, setShowModal] = useState(false);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showModal) {
      const text = "engineering";
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setChannelName(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showModal]);

  return (
    <div className="relative h-full">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-48 border-r border-border bg-muted/30 p-3">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Channels
          </span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          >
            <Plus className="h-4 w-4 cursor-pointer text-primary" />
          </motion.div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
            <Hash className="h-4 w-4" />
            general
          </div>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
            <Hash className="h-4 w-4" />
            random
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="w-72 rounded-xl border border-border bg-card p-4 shadow-xl"
            >
              <h4 className="mb-4 font-medium">Create Channel</h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Channel name
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{channelName}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="h-4 w-0.5 bg-primary"
                    />
                  </div>
                </div>
                <motion.button
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: channelName.length > 0 ? 1 : 0.5 }}
                  className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground"
                >
                  Create Channel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepTwoMockup() {
  const [invitedMembers, setInvitedMembers] = useState<number[]>([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setInvitedMembers([0]), 800),
      setTimeout(() => setInvitedMembers([0, 1]), 1600),
      setTimeout(() => setInvitedMembers([0, 1, 2]), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const members = [
    { name: "Sarah Chen", email: "sarah@company.com" },
    { name: "Alex Kim", email: "alex@company.com" },
    { name: "Jordan Lee", email: "jordan@company.com" },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <h4 className="mb-2 font-medium">Invite Team Members</h4>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <AtSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Enter email addresses...
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {members.map((member, index) => (
          <motion.div
            key={member.email}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: invitedMembers.includes(index) ? 1 : 0.4,
              x: 0,
            }}
            transition={{ delay: index * 0.2 }}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3 transition-colors",
              invitedMembers.includes(index)
                ? "border-primary/50 bg-primary/5"
                : "border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                  invitedMembers.includes(index)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            {invitedMembers.includes(index) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs font-medium text-primary"
              >
                Invited ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StepThreeMockup() {
  const [messages, setMessages] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const sequence = [
      () => setMessages([0]),
      () => setTyping(true),
      () => {
        setTyping(false);
        setMessages([0, 1]);
      },
      () => setTyping(true),
      () => {
        setTyping(false);
        setMessages([0, 1, 2]);
      },
    ];

    const timers = sequence.map((fn, i) => setTimeout(fn, (i + 1) * 1000));
    return () => timers.forEach(clearTimeout);
  }, []);

  const chatMessages = [
    {
      sender: "Sarah",
      content: "Hey team! Ready for the standup?",
      isMe: false,
    },
    { sender: "You", content: "Yes! Just finishing up a PR", isMe: true },
    { sender: "Alex", content: "Give me 2 minutes 🏃", isMe: false },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Channel Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">engineering</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 p-4">
        {chatMessages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: messages.includes(index) ? 1 : 0,
              y: messages.includes(index) ? 0 : 10,
            }}
            className={cn("flex gap-3", msg.isMe && "flex-row-reverse")}
          >
            <div
              className={cn(
                "h-8 w-8 shrink-0 rounded-full",
                msg.isMe ? "bg-primary" : "bg-muted"
              )}
            />
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-3 py-2 text-sm",
                msg.isMe
                  ? "rounded-tr-sm bg-primary text-primary-foreground"
                  : "rounded-tl-sm bg-muted"
              )}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <motion.div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                />
              ))}
            </motion.div>
            Someone is typing...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <span className="flex-1 text-sm text-muted-foreground">
            Message #engineering
          </span>
          <Send className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function StepFourMockup() {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<number[]>([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowReplies(true), 500),
      setTimeout(() => setReplies([0]), 1200),
      setTimeout(() => setReplies([0, 1]), 1900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full flex-col p-4">
      {/* Original Message */}
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/20" />
          <span className="text-sm font-medium">Sarah</span>
          <span className="text-xs text-muted-foreground">10:30 AM</span>
        </div>
        <p className="text-sm">
          What do you all think about switching to the new API?
        </p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 flex items-center gap-1 text-xs text-primary"
        >
          <MessagesSquare className="h-3 w-3" />
          {replies.length} replies
        </motion.button>
      </div>

      {/* Thread Replies */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 space-y-2 border-l-2 border-primary/30 pl-4"
          >
            {[
              {
                name: "Alex",
                content: "I think it's a good idea! The docs look solid.",
              },
              {
                name: "Jordan",
                content: "Agreed, let's discuss in tomorrow's standup",
              },
            ].map((reply, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: replies.includes(index) ? 1 : 0,
                  x: replies.includes(index) ? 0 : -10,
                }}
                className="flex items-start gap-2"
              >
                <div className="h-5 w-5 shrink-0 rounded-full bg-muted" />
                <div>
                  <span className="text-xs font-medium">{reply.name}</span>
                  <p className="text-sm text-muted-foreground">
                    {reply.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// function StepFiveMockup() {
//   const [reactions, setReactions] = useState<string[]>([]);
//   const [showPicker, setShowPicker] = useState(false);

//   // Ref to store reaction counts — generated once
//   const reactionCountsRef = useRef<Record<string, number>>({});

//   const allEmoji = ["👍", "❤️", "😂", "😮", "🎉", "🚀"];

//   // Generate counts only once, when a new emoji is added
//   useEffect(() => {
//     reactions.forEach((emoji) => {
//       if (!(emoji in reactionCountsRef.current)) {
//         reactionCountsRef.current[emoji] = Math.floor(Math.random() * 3) + 1;
//       }
//     });
//   }, [reactions]);

//   useEffect(() => {
//     const timers = [
//       setTimeout(() => setReactions(["🎉"]), 600),
//       setTimeout(() => setReactions(["🎉", "🚀"]), 1200),
//       setTimeout(() => setShowPicker(true), 1800),
//       setTimeout(() => setReactions(["🎉", "🚀", "❤️"]), 2400),
//       setTimeout(() => setShowPicker(false), 2600),
//     ];
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   return (
//     <div className="flex h-full flex-col items-center justify-center p-4">
//       {/* Message */}
//       <div className="w-full max-w-sm rounded-lg border border-border bg-muted/30 p-4">
//         <div className="mb-2 flex items-center gap-2">
//           <div className="h-8 w-8 rounded-full bg-primary" />
//           <div>
//             <span className="text-sm font-medium">You</span>
//             <span className="ml-2 text-xs text-muted-foreground">Just now</span>
//           </div>
//         </div>
//         <p className="mb-3 text-sm">
//           Just shipped the new feature! 🚀 Thanks everyone for the help!
//         </p>

//         {/* Reactions */}
//         <div className="flex flex-wrap gap-1.5">
//           <AnimatePresence>
//             {reactions.map((emoji) => (
//               <motion.span
//                 key={emoji}
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 exit={{ scale: 0 }}
//                 className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm ring-1 ring-primary/20"
//               >
//                 {emoji}
//                 <span className="text-xs text-muted-foreground">
//                   {reactionCountsRef.current[emoji]}
//                 </span>
//               </motion.span>
//             ))}
//           </AnimatePresence>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground"
//           >
//             <Smile className="h-4 w-4" />
//           </motion.button>
//         </div>
//       </div>

//       {/* Emoji Picker */}
//       <AnimatePresence>
//         {showPicker && (
//           <motion.div
//             initial={{ opacity: 0, y: 10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 10, scale: 0.95 }}
//             className="mt-4 flex gap-2 rounded-xl border border-border bg-card p-3 shadow-lg"
//           >
//             {allEmoji.map((emoji) => (
//               <motion.span
//                 key={emoji}
//                 whileHover={{ scale: 1.2 }}
//                 className={cn(
//                   "cursor-pointer text-xl transition-transform",
//                   emoji === "❤️" && "scale-125"
//                 )}
//               >
//                 {emoji}
//               </motion.span>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

const mockups: Record<number, React.ReactNode> = {
  1: <StepOneMockup />,
  2: <StepTwoMockup />,
  3: <StepThreeMockup />,
  4: <StepFourMockup />,
  // 5: <StepFiveMockup />,
};

export default function Features() {
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= steps.length ? 1 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-medium uppercase tracking-wider text-primary"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Get started in minutes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-lg text-muted-foreground"
          >
            From creating your first channel to collaborating with your team,
            here&apos;s how Revo works.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Steps */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;

                return (
                  <motion.button
                    key={step.id}
                    onClick={() => {
                      setActiveStep(step.id);
                      setIsAutoPlaying(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-200",
                      isActive ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                  >
                    {/* Step Number */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step.id}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium transition-colors",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.title}
                        </span>
                      </div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-sm text-muted-foreground"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-all",
                        isActive
                          ? "text-primary opacity-100"
                          : "opacity-0 group-hover:opacity-50"
                      )}
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 flex gap-1.5 px-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id);
                    setIsAutoPlaying(false);
                  }}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
                >
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        step.id < activeStep
                          ? "100%"
                          : step.id === activeStep
                          ? "100%"
                          : "0%",
                    }}
                    transition={{
                      duration:
                        step.id === activeStep && isAutoPlaying ? 4 : 0.3,
                      ease: "linear",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              {/* Window Header */}
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-4 text-xs text-muted-foreground">
                  Revo - {steps.find((s) => s.id === activeStep)?.title}
                </span>
              </div>

              {/* Content */}
              <div className="h-80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {mockups[activeStep]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
