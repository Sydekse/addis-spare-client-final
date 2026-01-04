"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, Send, Mail, MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNotifications } from "@/lib/api/services/notifications.service";
import {
  Notification,
  NotificationChannel,
  NotificationStatus,
} from "@/types/notification";

// Component
export default function NotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<
    Omit<Notification, "id" | "createdAt" | "sentAt">
  >({
    userId: "",
    channel: NotificationChannel.GMAIL,
    subject: "",
    message: "",
    status: NotificationStatus.PENDING,
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await getNotifications();
      setNotifications(notifications);
    };
    fetchNotifications();
  }, []);

  const getStatusBadge = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.SENT:
        return (
          <Badge variant="outline" className="text-green-600">
            Sent
          </Badge>
        );
      case NotificationStatus.PENDING:
        return (
          <Badge variant="outline" className="text-blue-600">
            Pending
          </Badge>
        );
      case NotificationStatus.FAILED:
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case NotificationChannel.GMAIL:
        return <Mail className="h-4 w-4" />;
      case NotificationChannel.SMS:
        return <MessageSquare className="h-4 w-4" />;
      case NotificationChannel.IN_APP:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleSendNotification = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id
          ? { ...n, status: NotificationStatus.SENT, sentAt: new Date() }
          : n
      )
    );
  };

  const handleCreateNotification = () => {
    const notification: Notification = {
      id: "",
      createdAt: new Date(),
      ...newNotification,
    };
    setNotifications([notification, ...notifications]);
    setNewNotification({
      userId: "",
      channel: NotificationChannel.GMAIL,
      subject: "",
      message: "",
      status: NotificationStatus.PENDING,
    });
    setIsComposerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Notifications</h1>
        <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notification List</CardTitle>
          <CardDescription>
            {notifications.length} notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>
                    {n.subject || n.message.substring(0, 50) + "..."}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getChannelIcon(n.channel)} {n.channel}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(n.status)}</TableCell>
                  <TableCell>{n.createdAt.toLocaleString()}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedNotification(n)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {n.status === NotificationStatus.PENDING && (
                      <Button
                        size="sm"
                        onClick={() => handleSendNotification(n.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Composer Dialog */}
      {isComposerOpen && (
        <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label>Channel</label>
                <Select
                  value={newNotification.channel}
                  onValueChange={(val) =>
                    setNewNotification({
                      ...newNotification,
                      channel: val as NotificationChannel,
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NotificationChannel.GMAIL}>
                      Email
                    </SelectItem>
                    <SelectItem value={NotificationChannel.SMS}>SMS</SelectItem>
                    <SelectItem value={NotificationChannel.IN_APP}>
                      In-App
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label>Subject</label>
                <Input
                  value={newNotification.subject}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      subject: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Message</label>
                <Input
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsComposerOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>Save & Send</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Notification Details Dialog */}
      {selectedNotification && (
        <Dialog
          open={!!selectedNotification}
          onOpenChange={() => setSelectedNotification(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Notification Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <strong>Subject:</strong> {selectedNotification.subject}
              </div>
              <div>
                <strong>Message:</strong> {selectedNotification.message}
              </div>
              <div>
                <strong>Channel:</strong> {selectedNotification.channel}
              </div>
              <div>
                <strong>Status:</strong> {selectedNotification.status}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {selectedNotification.createdAt.toLocaleString()}
              </div>
              {selectedNotification.sentAt && (
                <div>
                  <strong>Sent:</strong>{" "}
                  {selectedNotification.sentAt.toLocaleString()}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
