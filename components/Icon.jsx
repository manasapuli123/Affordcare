"use client";

import {
  Home,
  Calculator,
  Search,
  ClipboardList,
  UploadCloud,
  ListChecks,
  Bell,
  User,
  Check,
  ArrowRight,
  CreditCard,
  Gift,
  Heart,
  HeartHandshake,
  Pill,
  Shield,
  Clock,
  AlertTriangle,
  RefreshCw,
  ClipboardCheck,
  FileText,
  Receipt,
  PenLine,
  X,
} from "lucide-react";

const ICONS = {
  Home,
  Calculator,
  Search,
  ClipboardList,
  UploadCloud,
  ListChecks,
  Bell,
  User,
  Check,
  ArrowRight,
  CreditCard,
  Gift,
  Heart,
  HeartHandshake,
  Pill,
  Shield,
  Clock,
  AlertTriangle,
  RefreshCw,
  ClipboardCheck,
  FileText,
  Receipt,
  PenLine,
  X,
};

export default function Icon({ name, className = "", size = 18 }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp className={className} size={size} aria-hidden="true" />;
}
