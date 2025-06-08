import { ViewEntity } from '@/core/entities/view';

export interface VwUrlClicksSummaryProps {
  id: string;
  shortenedUrlId: string;
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userEmail: string;
  clickDate: Date;
  clickHour: number;
  clickCount: number;
}

export class VwUrlClicksSummary extends ViewEntity<VwUrlClicksSummaryProps> {
  protected constructor(props: VwUrlClicksSummaryProps) {
    super(props);
  }

  protected getIdentifier(): string {
    return this.props.id;
  }

  get id() {
    return this.props.id;
  }

  get shortenedUrlId() {
    return this.props.shortenedUrlId;
  }

  get shortCode() {
    return this.props.shortCode;
  }

  get originalUrl() {
    return this.props.originalUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get userId() {
    return this.props.userId;
  }

  get userName() {
    return this.props.userName;
  }

  get userEmail() {
    return this.props.userEmail;
  }

  get clickDate() {
    return this.props.clickDate;
  }

  get clickHour() {
    return this.props.clickHour;
  }

  get clickCount() {
    return this.props.clickCount;
  }

  static create(props: VwUrlClicksSummaryProps) {
    return new VwUrlClicksSummary(props);
  }
}
