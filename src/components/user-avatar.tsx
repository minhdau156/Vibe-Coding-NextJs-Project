import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const initials = getInitials(user?.name || "");

  return (
    <Avatar className={className}>
      {user?.image ? (
        <AvatarImage src={user.image} alt={user.name || "User avatar"} />
      ) : null}
      <AvatarFallback className="rounded-lg">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function getInitials(name: string) {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
