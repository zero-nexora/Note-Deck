"use client";

import React from "react";
import { Edit2, Trash2, UserPlus, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface UserGroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    members: string[];
  };
}

export const UserGroupCard: React.FC<UserGroupCardProps> = ({ group }) => {
  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">{group.name}</CardTitle>
              <CardDescription className="text-xs">{group.members.length} members</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{group.description}</p>

        {/* Permissions */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Permissions
          </h4>
          <div className="flex flex-wrap gap-1">
            {group.permissions.slice(0, 4).map((permission) => (
              <Badge key={permission} variant="secondary" className="text-xs">
                {permission.replace(/_/g, " ")}
              </Badge>
            ))}
            {group.permissions.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{group.permissions.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Members */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Members
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {group.members.slice(0, 4).map((memberId) => {
                const user = {
                  name: "John Doe",
                  avatar: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                };
                return (
                  <Avatar key={memberId} className="w-8 h-8 border-2 border-card">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                      {user?.name.split(" ").map((n) => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
