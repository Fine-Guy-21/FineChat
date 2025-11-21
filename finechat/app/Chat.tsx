"use client";

import {
  useState,
  useRef,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowLeft,
  MoreVertical,
  Send,
  UserMinus,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
  isOwn?: boolean;
  type?: "text" | "image" | "file";
}

interface Chat {
  id: string;
  name: string;
  type: "group" | "private";
  course?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  members?: number;
  isOnline?: boolean;
}

const mockChats: Chat[] = [
  {
    id: "4",
    name: "Sarah Johnson",
    type: "private",
    lastMessage: "Thanks for the study notes!",
    timestamp: "5 min",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "5",
    name: "Mike Chen",
    type: "private",
    lastMessage: "Are you joining the study group?",
    timestamp: "30 min",
    unreadCount: 2,
    isOnline: false,
  },
  {
    id: "6",
    name: "Dr. Emily Davis",
    type: "private",
    lastMessage: "Your assignment looks good",
    timestamp: "2h",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "9",
    name: "Sarah Johnson",
    type: "private",
    lastMessage: "Thanks for the study notes!",
    timestamp: "5 min",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "7",
    name: "Mike Chen",
    type: "private",
    lastMessage: "Are you joining the study group?",
    timestamp: "30 min",
    unreadCount: 2,
    isOnline: false,
  },
  {
    id: "8",
    name: "Dr. Emily Davis",
    type: "private",
    lastMessage: "Your assignment looks good",
    timestamp: "2h",
    unreadCount: 0,
    isOnline: true,
  },
];

const mockMessages: any[] = [
  {
    id: "1",
    sender: "Alex Thompson",
    content:
      "Hey everyone! I'm having trouble understanding the useEffect hook. Can someone explain when to use the dependency array?",
    timestamp: "10:30 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    content:
      "Great question! The dependency array controls when the effect runs. If you pass an empty array [], it only runs once after the initial render.",
    timestamp: "10:32 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    sender: "You",
    content:
      "That makes sense! So if I want it to run every time a specific state changes, I include that state in the array?",
    timestamp: "10:35 AM",
    isOwn: true,
  },
  {
    id: "4",
    sender: "Mike Chen",
    content:
      "Exactly! And if you don't provide a dependency array at all, the effect runs after every render.",
    timestamp: "10:36 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export function Chats() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  // No folder toggles needed for personal chats

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending logic here
      setNewMessage("");
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Chat List */}
      <div
        className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-300",
          isMobile && selectedChat ? "hidden" : "w-full md:w-80",
          isMobile ? "w-full" : ""
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold font-sans">Chats</h2>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search chats..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat Folders - Scrollable, matches sidebar height on all screens */}
        <div
          className="flex-1 min-h-0 overflow-y-auto md:max-h-[calc(100vh-112px)] md:overflow-y-auto scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="p-2">
            <div className="ml-0 space-y-1 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {filteredChats.map((chat: Chat) => (
                <Button
                  key={chat.id}
                  variant={selectedChat?.id === chat.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto overflow-hidden p-2 md:p-2 md:pr-3 md:pl-3 md:max-w-full",
                    "!rounded-lg"
                  )}
                  style={{
                    maxWidth: "100%",
                    minWidth: 0,
                    paddingLeft: isMobile ? undefined : 12,
                    paddingRight: isMobile ? undefined : 12,
                  }}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center space-x-3 w-full overflow-hidden">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        {typeof chat.unreadCount === "number" && chat.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 text-xs">{chat.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-0",
          isMobile && !selectedChat ? "hidden" : "flex"
        )}
      >
        {selectedChat ? (
          <>
            {/* Chat Header - sticky */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChat.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedChat.isOnline ? "Online" : "Last seen recently"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* group features removed - personal chats only */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive">
                      <UserMinus className="w-4 h-4 mr-2" />
                      Block User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages Area - scrollable */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-end gap-2 mb-2",
                          message.isOwn ? "justify-end" : ""
                        )}
                      >
                        {!message.isOwn && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={message.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>{message.sender[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "flex flex-col ",
                            message.isOwn ? "items-end" : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2 text-sm shadow-sm",
                              message.isOwn
                                ? "bg-primary text-primary-foreground ml-auto"
                                : "bg-muted text-foreground"
                            )}
                            style={{
                              maxWidth: "90vw",
                              wordBreak: "break-word",
                            }}
                          >
                            {!message.isOwn && (
                              <span className="block font-bold text-xs mb-1">
                                {message.sender}
                              </span>
                            )}
                            {message.content}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
              {/* Member list removed - personal chats only */}
            </div>

            {/* Message Input - sticky at bottom */}
            <div className="p-4 border-t border-border bg-card sticky bottom-0 z-10">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-muted-foreground">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
