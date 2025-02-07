import { CoreMenu } from "@core/types";
import { Role } from "../auth/models";

const roles = Role;
export const menu: CoreMenu[] = [
  {
    id: "admin",
    title: "Admin",
    type: "section",
    role: [roles.Admin, roles.Viewer],
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "item",
        icon: "home",
        url: "main/reports",
        role: [roles.Admin, roles.Viewer],
      },
      {
        id: "batches",
        title: "Batches",
        type: "item",
        icon: "box",
        url: "main/admin/batch/view",
        role: [roles.Admin],
      },
      {
        id: "statistics",
        title: "Statistics",
        type: "item",
        url: "main/admin/statistics",
        icon: "activity",
        role: [roles.Admin],
      },
      {
        id: "users",
        title: "Users",
        type: "item",
        icon: "users",
        url: "main/users",
        role: [roles.Admin],
      },
      {
        id: "re-review-batches",
        title: "Re-Review Batches",
        type: "item",
        icon: "refresh-ccw",
        url: "main/rereview",
        role: [roles.Admin,roles.User, roles.Moderator],
      },
    ],
  },
  {
    id: "home",
    title: "home",
    type: "section",
    role: [roles.Moderator, roles.User],
    children: [
      {
        id: "home",
        title: "Home",
        type: "item",
        icon: "home",
        url: "main/users",
        role: [roles.Moderator, roles.User],
      },
    ],
  },
  {
    id: "language",
    title: "Language",
    type: "section",
    role: [roles.Viewer],
    children: [
      {
        id: "language-sentences",
        title: "Sentences",
        type: "item",
        icon: "align-center",
        url: "main/sentences",
        role: [roles.Admin, roles.Viewer],
      },
    ],
  },
  {
    id: "translation",
    title: "Translation",
    type: "section",
    role: [roles.Admin, roles.User, roles.Moderator],
    children: [
      {
        id: "text-translation",
        title: "Text Translation",
        type: "item",
        icon: "type",
        url: "main/text-translate/translate",
        role: [roles.Admin, roles.User, roles.Moderator],
      },
      {
        id: "text-moderation",
        title: "Text Moderation",
        type: "item",
        icon: "check",
        url: "main/text-translate/moderate",
        role: [roles.Admin, roles.Moderator],
      },
      {
        id: "expert-text-review",
        title: "Expert Text Review",
        type: "item",
        icon: "user-check",
        url: "main/text-translate/expert-review",
        role: [roles.Admin, roles.Moderator],
      },
      {
        id: "voice-translation",
        title: "Voice Translation",
        type: "item",
        icon: "mic",
        url: "main/oral-translate/translate/recording",
        role: [roles.Admin, roles.User, roles.Moderator],
      },
      {
        id: "voice-moderation",
        title: "Voice Moderation",
        type: "item",
        icon: "check",
        url: "main/oral-moderate/moderate/reviewing",
        role: [roles.Admin, roles.Moderator],
      },
    ],
  },
];
