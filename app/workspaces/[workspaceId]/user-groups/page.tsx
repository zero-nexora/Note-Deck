import { UserGroupsList } from "@/components/user-group/user-group-list";

const UserGroupsPage = () => {
  const mockUserGroups = [
    {
      id: "g1",
      name: "Administrators",
      description: "Full access to all workspace features",
      permissions: [
        "manage_workspace",
        "manage_members",
        "manage_boards",
        "manage_billing",
      ],
      members: ["u1"],
    },
    {
      id: "g2",
      name: "Developers",
      description: "Access to development boards and features",
      permissions: ["view_boards", "edit_cards", "comment"],
      members: ["u2", "u4"],
    },
    {
      id: "g3",
      name: "Designers",
      description: "Access to design-related boards",
      permissions: [
        "view_boards",
        "edit_cards",
        "comment",
        "upload_attachments",
      ],
      members: ["u3", "u5"],
    },
  ];
  return (
    <div>
      <UserGroupsList userGroups={mockUserGroups} />
    </div>
  );
};

export default UserGroupsPage;
