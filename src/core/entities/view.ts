export abstract class ViewEntity<Props> {
  protected readonly props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  public getProps(): Props {
    return { ...this.props };
  }

  protected abstract getIdentifier(): unknown;

  public equals(view: ViewEntity<Props>): boolean {
    if (view === this) {
      return true;
    }

    return this.getIdentifier() === view.getIdentifier();
  }
}
