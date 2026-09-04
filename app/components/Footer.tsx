import { ImGithub } from "react-icons/im";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="text-center py-4 bg-muted text-muted-foreground">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <span>Made by Iman Jalali · 2026</span>

        <a
          href="https://github.com/imanPlus"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ImGithub />
          Github
        </a>

        <a
          href="mailto:i.jalali88@gmail.com"
          className="flex items-center gap-1 hover:text-foreground"
        >
          <MdEmail />
          Email
        </a>
      </div>
    </footer>
  );
}
