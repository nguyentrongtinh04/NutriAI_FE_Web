import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { X, CheckCircle2, AlertTriangle, Info, CircleX, Trophy, Upload, Clock } from "lucide-react";
import { createPortal } from "react-dom";

// ===== Kiểu dữ liệu =====
export type NoticeType = "success" | "error" | "warning" | "info" | "achievement" | "upload";
export type NoticePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface Notice {
  id: string;
  type: NoticeType;
  title?: string;
  message: string;
  timeout?: number; // ms; 0 = không tự tắt
  action?: { label: string; onClick: () => void };
}

type Ctx = {
  push: (n: Omit<Notice, "id">) => void;
  success: (msg: string, opts?: Partial<Omit<Notice, "id" | "type" | "message">>) => void;
  error: (msg: string, opts?: Partial<Omit<Notice, "id" | "type" | "message">>) => void;
  warning: (msg: string, opts?: Partial<Omit<Notice, "id" | "type" | "message">>) => void;
  info: (msg: string, opts?: Partial<Omit<Notice, "id" | "type" | "message">>) => void;
  achievement: (msg: string, opts?: Partial<Omit<Notice, "id" | "type" | "message">>) => void;
  upload: (msg: string, opts?: Partial<Omit<Notice, "id" | "type" | "message">>) => void;
};

const NoticeContext = createContext<Ctx | null>(null);
export const useNotify = () => {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotify must be used inside <NotificationsProvider>");
  return ctx;
};

// ===== Map kiểu -> màu & icon =====
const VARIANTS: Record<
  NoticeType,
  { icon: React.ComponentType<any>; ring: string; bg: string; text: string; border: string; pill: string }
> = {
  success:     { icon: CheckCircle2, ring: "ring-emerald-300/50", bg: "from-emerald-50 to-green-50", text: "text-emerald-800", border: "border-emerald-200", pill: "bg-emerald-100 text-emerald-700" },
  error:       { icon: CircleX,      ring: "ring-rose-300/50",    bg: "from-rose-50 to-red-50",      text: "text-rose-800",    border: "border-rose-200",    pill: "bg-rose-100 text-rose-700" },
  warning:     { icon: AlertTriangle,ring: "ring-amber-300/50",   bg: "from-amber-50 to-yellow-50",  text: "text-amber-800",   border: "border-amber-200",   pill: "bg-amber-100 text-amber-700" },
  info:        { icon: Info,         ring: "ring-sky-300/50",     bg: "from-sky-50 to-cyan-50",      text: "text-sky-800",     border: "border-sky-200",     pill: "bg-sky-100 text-sky-700" },
  achievement: { icon: Trophy,       ring: "ring-violet-300/50",  bg: "from-violet-50 to-fuchsia-50",text: "text-violet-800",  border: "border-violet-200",  pill: "bg-violet-100 text-violet-700" },
  upload:      { icon: Upload,       ring: "ring-blue-300/50",    bg: "from-blue-50 to-indigo-50",   text: "text-blue-800",    border: "border-blue-200",    pill: "bg-blue-100 text-blue-700" },
};

// ===== Toast item =====
function Toast({ n, onClose }: { n: Notice; onClose: (id: string) => void }) {
  const V = VARIANTS[n.type];
  const Icon = V.icon;
  return (
    <div className="relative">
      <div className={`absolute -inset-1 bg-gradient-to-r ${V.pill.replace("bg-","from-").replace(" text-"," to-")} rounded-2xl blur opacity-30`} />
      <div className={`relative w-[360px] max-w-[92vw] rounded-2xl border ${V.border} bg-white/90 backdrop-blur-sm shadow-xl ring-2 ${V.ring}`}>
        <div className="p-4 flex gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${V.pill}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            {n.title && <div className={`font-semibold ${V.text}`}>{n.title}</div>}
            <div className="text-gray-700 text-sm leading-relaxed">{n.message}</div>
            {n.action && (
              <button onClick={n.action.onClick} className="mt-2 text-xs font-semibold underline underline-offset-4">
                {n.action.label}
              </button>
            )}
          </div>
          <button onClick={() => onClose(n.id)} className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Container vị trí + portal =====
function ToastContainer({
  items,
  onClose,
  position = "top-right",
}: {
  items: Notice[];
  onClose: (id: string) => void;
  position?: NoticePosition;
}) {
  const pos =
    position === "top-right"
      ? "top-4 right-4 items-end"
      : position === "top-left"
      ? "top-4 left-4 items-start"
      : position === "bottom-left"
      ? "bottom-4 left-4 items-start"
      : "bottom-4 right-4 items-end";

  return createPortal(
    <div className={`pointer-events-none fixed z-[1000] flex flex-col gap-3 ${pos}`}>
      {items.map((n) => (
        <div key={n.id} className="pointer-events-auto transition-all animate-[fadeIn_.2s_ease-out]">
          <Toast n={n} onClose={onClose} />
        </div>
      ))}
    </div>,
    document.body
  );
}

// ===== Provider + API =====
export function NotificationsProvider({
    children,
    position = "top-right" as NoticePosition,
  }: {
    children: React.ReactNode;
    position?: NoticePosition;
  }) {
    const [items, setItems] = useState<Notice[]>([]);
    const timers = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    const t = timers.current[id];
    if (t) {
      window.clearTimeout(t);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    (n: Omit<Notice, "id">) => {
      const id = crypto.randomUUID();
      const timeout = n.timeout ?? 4000;
      const notice: Notice = { id, ...n };
      setItems((prev) => [notice, ...prev]);
      if (timeout && timeout > 0) {
        timers.current[id] = window.setTimeout(() => remove(id), timeout);
      }
    },
    [remove]
  );

  const api = useMemo<Ctx>(
    () => ({
      push,
      success: (msg, o) => push({ type: "success", message: msg, ...o }),
      error: (msg, o) => push({ type: "error", message: msg, ...o }),
      warning: (msg, o) => push({ type: "warning", message: msg, ...o }),
      info: (msg, o) => push({ type: "info", message: msg, ...o }),
      achievement: (msg, o) => push({ type: "achievement", message: msg, ...o }),
      upload: (msg, o) => push({ type: "upload", message: msg, ...o }),
    }),
    [push]
  );

  return (
    <NoticeContext.Provider value={api}>
      {children}
      <ToastContainer items={items} onClose={remove} position={position} />
    </NoticeContext.Provider>
  );
}

// ===== AlertBanner (inline lớn trong trang) =====
export function AlertBanner({
  type,
  title,
  message,
  timeAgo,
  className = "",
  children,
}: {
  type: NoticeType;
  title: string;
  message?: string;
  timeAgo?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const V = VARIANTS[type];
  const Icon = V.icon;
  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute -inset-1 bg-gradient-to-r ${V.pill.replace("bg-","from-").replace(" text-"," to-")} rounded-3xl blur opacity-30`} />
      <div className={`relative rounded-3xl border ${V.border} bg-gradient-to-r ${V.bg} p-5 md:p-6`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${V.pill}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg">{title}</div>
            {message && <div className="text-gray-700 mt-1">{message}</div>}
            {children}
            {timeAgo && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeAgo}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
