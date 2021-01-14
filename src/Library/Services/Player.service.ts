const BID_VALUE: number = 20;
class PlayerService {
  public credits: number = 100;
  public bid: number = 0;
  constructor() {}
  public bidCredit = () => {
    console.log('A');
    if (this.useCredits(BID_VALUE)) {
      this.bid += BID_VALUE;
    }
  };
  public useCredits = (credits: number) => {
    if (this.credits < credits) return false;
    this.credits -= credits;
    return true;
  };
}

export default PlayerService;
