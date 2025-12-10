import React from "react";
import { User } from "../models/auth";
import { UserIcon } from "lucide-react";

type UserCardProps = {
  user?: User | null;
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map(s => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <div className="w-full flex items-center gap-4 px-4 py-2 bg-accent rounded-lg">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold">
        {initials ? (
          <span className="text-primary-foreground">{initials}</span>
        ) : (
          <UserIcon className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div>
        <p className="font-semibold text-foreground">{user?.name ?? ""}</p>
        <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
      </div>
    </div>
  );
};

export default UserCard;
