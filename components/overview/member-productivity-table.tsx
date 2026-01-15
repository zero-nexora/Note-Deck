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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MemberProductivity } from "@/domain/types/analytics.type";
import { Users, TrendingUp, MessageSquare, Activity } from "lucide-react";

interface MemberProductivityTableProps {
  data: MemberProductivity[];
}

export const MemberProductivityTable = ({
  data,
}: MemberProductivityTableProps) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Member Productivity
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Team member performance and activity metrics
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-foreground font-semibold">
                  Member
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Assigned
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Completed
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Comments
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Activities
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Completion Rate
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((member) => (
                <TableRow key={member.userId} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={member.userImage || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {member.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {member.userName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.userEmail}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {member.assignedCards}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {member.completedCards}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {member.commentsCount}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {member.activitiesCount}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[120px]">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            member.completionRate >= 70
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }
                        >
                          {member.completionRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={member.completionRate} className="h-2" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
