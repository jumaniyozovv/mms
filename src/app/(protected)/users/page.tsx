"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  HelpCircleIcon,
  GlobeIcon,
  WifiIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUsers } from "@/features/users/hooks";
import type { DeviceSession, DeviceType, UserWithSessions } from "@/features/users/types";

function getDeviceIcon(type: DeviceType) {
  switch (type) {
    case "DESKTOP":
      return <MonitorIcon className="size-4" />;
    case "MOBILE":
      return <SmartphoneIcon className="size-4" />;
    case "TABLET":
      return <TabletIcon className="size-4" />;
    default:
      return <HelpCircleIcon className="size-4" />;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function roleBadgeVariant(role: string) {
  switch (role) {
    case "ADMIN":
      return "default" as const;
    case "MANAGER":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function SessionRow({ session }: { session: DeviceSession }) {
  const isActive = !session.disconnectedAt;

  return (
    <TableRow className="bg-muted/30">
      <TableCell />
      <TableCell>
        <div className="flex items-center gap-2 text-muted-foreground">
          {getDeviceIcon(session.deviceType)}
          <span className="text-xs">{session.deviceType}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <GlobeIcon className="size-3.5 text-muted-foreground" />
          <span className="text-xs">
            {session.browserName
              ? `${session.browserName} ${session.browserVersion ?? ""}`
              : "Unknown"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">
          {session.osName
            ? `${session.osName} ${session.osVersion ?? ""}`
            : "Unknown"}
        </span>
      </TableCell>
      <TableCell>
        {session.networkType ? (
          <div className="flex items-center gap-1.5">
            <WifiIcon className="size-3.5 text-muted-foreground" />
            <span className="text-xs">{session.networkType}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">
          {session.ipAddress ?? "-"}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={isActive ? "default" : "outline"} className="text-xs">
          {isActive ? "Active" : "Disconnected"}
        </Badge>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-muted-foreground cursor-default">
              {formatDate(session.connectedAt)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {session.disconnectedAt
              ? `Disconnected: ${formatDate(session.disconnectedAt)}`
              : "Currently connected"}
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function UserRow({ user }: { user: UserWithSessions }) {
  const [expanded, setExpanded] = useState(false);
  const sessionCount = user.deviceSessions.length;

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={() => sessionCount > 0 && setExpanded(!expanded)}
      >
        <TableCell className="w-8">
          {sessionCount > 0 && (
            expanded
              ? <ChevronDownIcon className="size-4 text-muted-foreground" />
              : <ChevronRightIcon className="size-4 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar size="sm">
                <AvatarFallback>
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background ${
                  user.isOnline ? "bg-green-500" : "bg-muted-foreground/40"
                }`}
              />
            </div>
            <div>
              <div className="font-medium text-sm">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={user.isActive ? "secondary" : "destructive"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant={user.isOnline ? "default" : "outline"}>
            {user.isOnline ? "Online" : "Offline"}
          </Badge>
        </TableCell>
        <TableCell>
          <span className="text-sm text-muted-foreground">
            {sessionCount}
          </span>
        </TableCell>
        <TableCell colSpan={2}>
          <span className="text-xs text-muted-foreground">
            {formatDate(user.createdAt)}
          </span>
        </TableCell>
      </TableRow>
      {expanded &&
        user.deviceSessions.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))}
    </>
  );
}

function UsersTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8" />
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Online</TableHead>
          <TableHead>Sessions</TableHead>
          <TableHead colSpan={2}>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell />
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell><Skeleton className="h-5 w-14" /></TableCell>
            <TableCell><Skeleton className="h-5 w-14" /></TableCell>
            <TableCell><Skeleton className="h-4 w-6" /></TableCell>
            <TableCell colSpan={2}><Skeleton className="h-4 w-32" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function UsersPage() {
  const { data: users, isLoading, error } = useUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage users and view their device sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <UsersTableSkeleton />
        ) : error ? (
          <div className="text-center py-8 text-sm text-destructive">
            Failed to load users.
          </div>
        ) : !users?.length ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No users found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Online</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead colSpan={2}>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
