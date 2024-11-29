export const EventStatus = {
  PENDING: 'PENDING', // 시작 전
  ONGOING: 'ONGOING', // 진행 중
  COMPLETED: 'COMPLETED', // 종료
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
