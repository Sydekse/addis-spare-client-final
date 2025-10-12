"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  User,
} from "lucide-react";

// ----------------- Types -----------------
type Ticket = {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  category:
    | "product_inquiry"
    | "order_issue"
    | "technical_support"
    | "billing"
    | "general";
  createdAt: string;
  lastUpdated: string;
  assignedTo: string | null;
  conversationId: string;
};

type ConversationMessage = {
  _id: string;
  senderId: string;
  senderName: string;
  message: string;
  sentAt: string;
  isSupport: boolean;
};

// Mock support ticket data
const mockTickets = [
  {
    _id: "TICKET-001",
    userId: "673c1f123456789abcdef001",
    userName: "Tekle Haile",
    userEmail: "tekle.haile@gmail.com", 
    subject: "Cannot find brake pads for Toyota Corolla 2018",
    message: "I'm looking for brake pads compatible with my Toyota Corolla 2018 model but the search isn't showing relevant results. Can you help me find the right parts?",
    status: "open",
    priority: "medium",
    category: "product_inquiry",
    createdAt: "2024-11-19T09:15:00Z",
    lastUpdated: "2024-11-19T09:15:00Z",
    assignedTo: null,
    conversationId: "CONV-001"
  },
  {
    _id: "TICKET-002", 
    userId: "673c1f123456789abcdef003",
    userName: "Sarah Mohammed",
    userEmail: "sarah.mohammed@yahoo.com",
    subject: "Order #ORD-12345 was cancelled without explanation",
    message: "My order for oil filters was cancelled yesterday but I didn't receive any explanation. The payment was already processed. Please help resolve this issue.",
    status: "in_progress",
    priority: "high",
    category: "order_issue",
    createdAt: "2024-11-18T14:30:00Z",
    lastUpdated: "2024-11-19T08:45:00Z", 
    assignedTo: "Support Agent 1",
    conversationId: "CONV-002"
  },
  {
    _id: "TICKET-003",
    userId: "673c1f123456789abcdef002",
    userName: "Hanan Auto Parts Ltd",
    userEmail: "info@hananautoparts.com",
    subject: "Need help updating product inventory",
    message: "We're having trouble updating our inventory quantities through the supplier portal. The system keeps showing an error when we try to update stock levels.",
    status: "resolved",
    priority: "low", 
    category: "technical_support",
    createdAt: "2024-11-17T11:20:00Z",
    lastUpdated: "2024-11-18T16:10:00Z",
    assignedTo: "Support Agent 2",
    conversationId: "CONV-003"
  },
  {
    _id: "TICKET-004",
    userId: "673c1f123456789abcdef001", 
    userName: "Tekle Haile",
    userEmail: "tekle.haile@gmail.com",
    subject: "Received wrong spare parts in my order",
    message: "I ordered air filters for Honda Civic but received brake discs instead. Order number is ORD-12346. Please arrange for return and refund.",
    status: "open",
    priority: "high",
    category: "order_issue", 
    createdAt: "2024-11-19T16:45:00Z",
    lastUpdated: "2024-11-19T16:45:00Z",
    assignedTo: null,
    conversationId: "CONV-004"
  }
];

// Mock conversation messages
const mockConversations = {
  "CONV-002": [
    {
      _id: "MSG-001",
      senderId: "673c1f123456789abcdef003",
      senderName: "Sarah Mohammed",
      message: "My order for oil filters was cancelled yesterday but I didn't receive any explanation. The payment was already processed. Please help resolve this issue.",
      sentAt: "2024-11-18T14:30:00Z",
      isSupport: false
    },
    {
      _id: "MSG-002", 
      senderId: "SUPPORT-001",
      senderName: "Support Agent 1",
      message: "Hi Sarah, I apologize for the inconvenience. I've located your order #ORD-12345 and can see that it was cancelled due to insufficient stock. Your payment will be refunded within 3-5 business days. Would you like me to help you find alternative oil filters that are currently in stock?",
      sentAt: "2024-11-18T15:20:00Z",
      isSupport: true
    },
    {
      _id: "MSG-003",
      senderId: "673c1f123456789abcdef003", 
      senderName: "Sarah Mohammed",
      message: "Thank you for the explanation. Yes, please help me find alternative oil filters for my Honda Accord 2019.",
      sentAt: "2024-11-19T08:45:00Z",
      isSupport: false
    }
  ]
};

// ----------------- Page Component -----------------
export default function Page() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (
    ticketId: string,
    newStatus
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket._id === ticketId
          ? {
              ...ticket,
              status: newStatus,
              lastUpdated: new Date().toISOString(),
            }
          : ticket
      )
    );
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    if (selectedTicket.status === "open") {
      handleStatusChange(selectedTicket._id, "in_progress");
    }

    console.log("Sending reply:", replyMessage);
    setReplyMessage("");
  };

  // ----------------- Helper Badge Renderers -----------------
  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-blue-600">
            Open
          </Badge>
        );
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600">
            Resolved
          </Badge>
        );
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Medium
          </Badge>
        );
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getCategoryLabel = (category: Ticket["category"]) => {
    switch (category) {
      case "product_inquiry":
        return "Product Inquiry";
      case "order_issue":
        return "Order Issue";
      case "technical_support":
        return "Technical Support";
      case "billing":
        return "Billing";
      case "general":
        return "General";
      default:
        return category;
    }
  };

  // ----------------- UI -----------------
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Customer Support</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and support tickets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Reports</Button>
          <Button>Create Ticket</Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter((t) => t.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter((t) => t.status === "in_progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter((t) => t.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter((t) => t.priority === "high").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell className="font-mono text-sm">
                  {ticket._id}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ticket.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.userEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{ticket.subject}</div>
                </TableCell>
                <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Ticket Details - {ticket._id}</DialogTitle>
                        <DialogDescription>
                          Support conversation with {ticket.userName}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedTicket && (
                        <div className="space-y-6">
                          {/* Ticket Info */}
                          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                            <div>
                              <label className="text-sm font-medium">
                                Customer
                              </label>
                              <p className="text-sm">
                                {selectedTicket.userName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedTicket.userEmail}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Created
                              </label>
                              <p className="text-sm">
                                {new Date(
                                  selectedTicket.createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Priority
                              </label>
                              <div className="mt-1">
                                {getPriorityBadge(selectedTicket.priority)}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Status
                              </label>
                              <div className="mt-1">
                                {getStatusBadge(selectedTicket.status)}
                              </div>
                            </div>
                          </div>

                          {/* Conversation */}
                          <div className="space-y-4">
                            <h4>Conversation History</h4>
                            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                              {/* Initial message */}
                              <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="h-4 w-4 text-blue-600" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">
                                      {selectedTicket.userName}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(
                                        selectedTicket.createdAt
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <h5 className="font-medium mb-2">
                                      {selectedTicket.subject}
                                    </h5>
                                    <p className="text-sm">
                                      {selectedTicket.message}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Additional conversation messages */}
                              {mockConversations[selectedTicket.conversationId]
                                ?.slice(1)
                                .map((msg) => (
                                  <div
                                    key={msg._id}
                                    className={`flex gap-3 ${msg.isSupport ? "flex-row-reverse" : ""}`}
                                  >
                                    <div className="flex-shrink-0">
                                      <div
                                        className={`w-8 h-8 rounded-full ${msg.isSupport ? "bg-green-100" : "bg-blue-100"} flex items-center justify-center`}
                                      >
                                        <User
                                          className={`h-4 w-4 ${msg.isSupport ? "text-green-600" : "text-blue-600"}`}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div
                                        className={`flex items-center gap-2 mb-1 ${msg.isSupport ? "flex-row-reverse" : ""}`}
                                      >
                                        <span className="font-medium">
                                          {msg.senderName}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                          {new Date(
                                            msg.sentAt
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                      <div
                                        className={`p-3 rounded-lg ${msg.isSupport ? "bg-green-50 ml-8" : "bg-gray-50 mr-8"}`}
                                      >
                                        <p className="text-sm">{msg.message}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Reply Section */}
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <Select
                                value={selectedTicket.status}
                                onValueChange={(value) =>
                                  handleStatusChange(selectedTicket._id, value)
                                }
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="resolved">
                                    Resolved
                                  </SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="outline" size="sm">
                                Escalate
                              </Button>
                              <Button variant="outline" size="sm">
                                Assign
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Reply to Customer
                              </label>
                              <Textarea
                                placeholder="Type your response here..."
                                value={replyMessage}
                                onChange={(e) =>
                                  setReplyMessage(e.target.value)
                                }
                                rows={4}
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Save Draft
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleSendReply}
                                  disabled={!replyMessage.trim()}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No support tickets found matching your criteria.
        </div>
      )}
    </div>
  );
}
