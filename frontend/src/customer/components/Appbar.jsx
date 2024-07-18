import { Avatar } from "./BlogCard";

export const Appbar = () => {
  return (
    <div className="border-b flex justify-between px-10 py-4">
      <div>Medium</div>
      <div>
        <Avatar name="hoeni ji" size={8} />
      </div>
    </div>
  );
};
