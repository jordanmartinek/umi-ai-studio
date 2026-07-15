import {
  Image as ImageIcon,
  Video,
  PenLine,
  BarChart3,
  GalleryHorizontal,
  Mail,
  ShoppingBag,
  Gift,
  BookOpen,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export interface ContentTypeMeta {
  slug: string;
  /** Key into dict.contentTypes for translated title/description. */
  dictKey:
    | "image"
    | "video"
    | "caption"
    | "poll"
    | "carousel"
    | "email"
    | "productDescription"
    | "promotion"
    | "story"
    | "reply";
  icon: LucideIcon;
  /** Live generators are wired up; others show a "coming soon" state. */
  live: boolean;
}

export const CONTENT_TYPES: ContentTypeMeta[] = [
  { slug: "image", dictKey: "image", icon: ImageIcon, live: true },
  { slug: "video", dictKey: "video", icon: Video, live: false },
  { slug: "caption", dictKey: "caption", icon: PenLine, live: true },
  { slug: "poll", dictKey: "poll", icon: BarChart3, live: true },
  { slug: "carousel", dictKey: "carousel", icon: GalleryHorizontal, live: false },
  { slug: "email", dictKey: "email", icon: Mail, live: false },
  {
    slug: "product-description",
    dictKey: "productDescription",
    icon: ShoppingBag,
    live: true,
  },
  { slug: "promotion", dictKey: "promotion", icon: Gift, live: false },
  { slug: "story", dictKey: "story", icon: BookOpen, live: true },
  { slug: "reply", dictKey: "reply", icon: MessageCircle, live: true },
];
