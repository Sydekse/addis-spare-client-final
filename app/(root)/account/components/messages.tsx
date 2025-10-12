"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  MessageCircle,
  CheckCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  createMessage,
  getConversation,
} from "@/lib/api/services/message.service";
import {
  MessagesByOtherUserDTO,
  CreateMessageDto,
  Message,
} from "@/types/messages";
import { useCloudinaryUpload } from "@/lib/cloudinary/uploadImage";

export default function SupplierMessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<MessagesByOtherUserDTO | null>(null);
  const [conversations, setConversations] = useState<MessagesByOtherUserDTO[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(true);
  const { uploadRawFile, loading: uploading } = useCloudinaryUpload();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        if (!user) return;
        const data: MessagesByOtherUserDTO[] = await getConversation(user.id);
        setConversations(data);
        if (data.length > 0) setSelectedConversation(data[0]);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user, user?.id]);

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const formatMessageTime = (date: string | Date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const flattenedMessages =
    selectedConversation?.messages.sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    ) || [];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages.some((msg) =>
        msg.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  // Send message with attachments
  const handleSendMessage = async () => {
    if (!selectedConversation || !user) return;
    if (!newMessage.trim() && files.length === 0) return;

    const recipientId = selectedConversation.user.id;

    try {
      // Upload files to Cloudinary
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const uploaded = await uploadRawFile(file);
        if (uploaded.secure_url) uploadedUrls.push(uploaded.secure_url);
      }

      const messageDto: CreateMessageDto = {
        conversationId: selectedConversation.messages[0]?.conversationId || "",
        senderId: user.id,
        recipientId,
        body: newMessage,
        attachments: uploadedUrls,
      };

      const createdMessage: Message = await createMessage(messageDto);

      // Optimistically update UI
      setSelectedConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, createdMessage] } : prev
      );

      setNewMessage("");
      setFiles([]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground text-lg">
          Loading conversations...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with your customers - {totalUnread} unread messages
          </p>
        </div>
      </div> */}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Conversations List */}
        <div className="lg:col-span-4">
          <Card className="h-[700px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[550px]">
                <div className="space-y-2 p-4">
                  {filteredConversations.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                      No conversations found.
                    </p>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.user.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.user.id === conv.user.id
                            ? "bg-primary/10 border-primary/20 border"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conv.user.avatar} />
                            <AvatarFallback>
                              {conv.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">
                                {conv.user.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {conv.messages.length > 0
                                    ? formatTime(
                                        conv.messages[conv.messages.length - 1]
                                          .sentAt
                                      )
                                    : "No messages"}
                                </span>
                                {conv.messages.some(
                                  (m) => !m.readAt && m.recipientId === user?.id
                                ) && (
                                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                    {
                                      conv.messages.filter(
                                        (m) =>
                                          !m.readAt &&
                                          m.recipientId === user?.id
                                      ).length
                                    }
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {conv.messages[conv.messages.length - 1]?.body ||
                                "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-8">
          {selectedConversation ? (
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.user.avatar} />
                      <AvatarFallback>
                        {selectedConversation.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedConversation.user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.user.email}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                {flattenedMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No messages in this conversation.
                  </div>
                ) : (
                  <ScrollArea className="h-[450px] p-4">
                    <div className="space-y-4">
                      {flattenedMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderId === user?.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.senderId === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.body}</p>
                            {msg.attachments?.length > 0 && (
                              <ul className="mt-2 space-y-1 text-xs underline">
                                {msg.attachments.map((att, i) => (
                                  <li key={i}>
                                    <a
                                      href={att}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {att}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span
                                className={`text-xs ${
                                  msg.senderId === user?.id
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatMessageTime(msg.sentAt)}
                              </span>
                              {msg.senderId === user?.id && (
                                <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-3 items-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" size="icon" asChild>
                      <span>
                        <Paperclip className="h-4 w-4" />
                      </span>
                    </Button>
                  </label>

                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={2}
                      className="resize-none"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    {(files.length > 0 || uploading) && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {uploading
                          ? "Uploading..."
                          : `${files.length} file(s) selected`}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && files.length === 0}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-[700px] flex flex-col items-center justify-center text-center p-6">
              <MessageCircle className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <CardTitle className="text-lg">No conversation</CardTitle>
              <CardContent className="text-muted-foreground">
                {conversations.length === 0
                  ? "You don’t have any conversations yet."
                  : "Please select a conversation"}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
