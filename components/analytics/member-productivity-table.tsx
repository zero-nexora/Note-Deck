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
import { MemberProductivity } from "@/domain/types/analytics.type";

interface MemberProductivityTableProps {
  data: MemberProductivity[];
}

export const MemberProductivityTable = ({
  data,
}: MemberProductivityTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Productivity</CardTitle>
        <CardDescription>
          Team member performance and activity metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Completion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member) => (
              <TableRow key={member.userId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.userImage || undefined} />
                      <AvatarFallback>
                        {member.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.userEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.assignedCards}</TableCell>
                <TableCell>{member.completedCards}</TableCell>
                <TableCell>{member.commentsCount}</TableCell>
                <TableCell>{member.activitiesCount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      member.completionRate >= 70 ? "default" : "secondary"
                    }
                  >
                    {member.completionRate.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
