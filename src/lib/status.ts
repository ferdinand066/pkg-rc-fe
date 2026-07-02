export const BORROWED_STATUS_CANCELED = 0;
export const BORROWED_STATUS_PENDING = 1;
export const BORROWED_STATUS_ACCEPTED = 2;

export type BorrowedStatus =
  | typeof BORROWED_STATUS_CANCELED
  | typeof BORROWED_STATUS_PENDING
  | typeof BORROWED_STATUS_ACCEPTED;

export const BORROWED_STATUS_LABELS: Record<BorrowedStatus, string> = {
  [BORROWED_STATUS_CANCELED]: "Dibatalkan",
  [BORROWED_STATUS_PENDING]: "Pending",
  [BORROWED_STATUS_ACCEPTED]: "Disetujui",
};

export const BORROWED_STATUS_BADGE_CLASSES: Record<BorrowedStatus, string> = {
  [BORROWED_STATUS_CANCELED]: "badge-error",
  [BORROWED_STATUS_PENDING]: "badge-warning",
  [BORROWED_STATUS_ACCEPTED]: "badge-success",
};

export const BORROWED_STATUS_FILTER_OPTIONS: { id: BorrowedStatus; name: string }[] = [
  {
    id: BORROWED_STATUS_PENDING,
    name: BORROWED_STATUS_LABELS[BORROWED_STATUS_PENDING],
  },
  {
    id: BORROWED_STATUS_ACCEPTED,
    name: BORROWED_STATUS_LABELS[BORROWED_STATUS_ACCEPTED],
  },
];

export const AGREEMENT_STATUS_DECLINED = 0;
export const AGREEMENT_STATUS_ACCEPTED = 1;

export type AgreementStatus =
  | typeof AGREEMENT_STATUS_DECLINED
  | typeof AGREEMENT_STATUS_ACCEPTED;

export const AGREEMENT_STATUS_DISPLAY: Record<
  AgreementStatus,
  { text: string; style: string }
> = {
  [AGREEMENT_STATUS_DECLINED]: {
    text: "menolak",
    style: "text-error",
  },
  [AGREEMENT_STATUS_ACCEPTED]: {
    text: "menyetujui",
    style: "text-success",
  },
};

export const USER_ROLE = 1;
export const ADMIN_ROLE = 2;
export const ADMIN_VIEWER_ROLE = 3;

export type UserRole =
  | typeof USER_ROLE
  | typeof ADMIN_ROLE
  | typeof ADMIN_VIEWER_ROLE;

export const USER_ROLE_MAPPING: { id: UserRole; name: string }[] = [
  {
    id: USER_ROLE,
    name: "User",
  },
  {
    id: ADMIN_ROLE,
    name: "Admin",
  },
];

export const getBorrowedStatusLabel = (status: BorrowedStatus): string =>
  BORROWED_STATUS_LABELS[status];

// Backward-compatible aliases
export const USER_ROLE_INT = USER_ROLE;
export const ADMIN_ROLE_INT = ADMIN_ROLE;
export const ADMIN_VIEWER_ROLE_INT = ADMIN_VIEWER_ROLE;
export const BORROWED_STATUS_CANCELLED_INT = BORROWED_STATUS_CANCELED;
export const BORROWED_STATUS_PENDING_INT = BORROWED_STATUS_PENDING;
export const BORROWED_STATUS_ACCEPTED_INT = BORROWED_STATUS_ACCEPTED;
export const BORROWED_STATUS = [
  BORROWED_STATUS_LABELS[BORROWED_STATUS_CANCELED],
  BORROWED_STATUS_LABELS[BORROWED_STATUS_PENDING],
  BORROWED_STATUS_LABELS[BORROWED_STATUS_ACCEPTED],
] as const;
