const BID_VALUE: number = 20;
class PlayerService {
  public credits: number = 1000;
  public bid: number = 0;
  constructor() {}
  public bidCredit = () => {
    if (this.useCredits(BID_VALUE)) {
      this.bid += BID_VALUE;
      return true;
    }
    return false;
  };
  public useCredits = (credits: number) => {
    if (this.credits < credits) return false;
    this.credits -= credits;
    return true;
  };
}

export default PlayerService;
