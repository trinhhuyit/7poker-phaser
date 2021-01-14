import {
  random,
  size,
  some,
  isEqual,
  groupBy,
  filter,
  sortBy,
  clamp,
  reduce,
  toNumber,
  times,
  maxBy,
  isEmpty,
  find,
  map,
  minBy,
  concat,
  take,
  last,
} from 'lodash';

import { generate } from 'shortid';
import Card from '../Components/Card.component';
const ALL_SUITS = ['of_clubs', 'of_diamonds', 'of_hearts', 'of_spades'];
const ALL_JOKER_SUITS = ['black', 'red'];
const ALL_KINDS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'jack',
  'queen',
  'king',
  'joker',
];
interface CardData {
  kind: string;
  suit: string;
  value?: number;
  _id: string;
}
class CardsService {
  public cardsData: CardData[] = [];
  public totalCards: number;

  constructor(totalCards: number) {
    this.totalCards = totalCards;
  }
  public randomKindSuit = () => {
    const newKind = ALL_KINDS[random(0, size(ALL_KINDS) - 1)];
    const allSuits = newKind === 'joker' ? ALL_JOKER_SUITS : ALL_SUITS;
    return {
      kind: newKind,
      suit: allSuits[random(0, size(allSuits) - 1)],
      value: this.correctKind(newKind),
      _id: generate(),
    };
  };

  public generateCardData = () => {
    this.cardsData = [];
    while (true) {
      const rndData = this.randomKindSuit();
      if (
        !some(this.cardsData, (currentCard) => {
          return (
            rndData.kind === currentCard.kind &&
            rndData.suit === currentCard.suit
          );
        })
      ) {
        this.cardsData.push(rndData);
      }
      if (size(this.cardsData) === this.totalCards) {
        break;
      }
    }
    const finalResult = this.checkResult(size(this.cardsData));
  };

  public getJokers(cardsData: CardData[]) {
    const jokers = filter(cardsData, { kind: 'joker' });
    return size(jokers);
  }

  //1,2,3,4...J,Q,K
  public filterByKind = (cardsData: CardData[], totalJokers: number) => {
    //Group by kind
    const groupedByKind = groupBy(cardsData, 'kind');
    const filteredGroupedByKind = filter(
      groupedByKind,
      (group) => totalJokers + size(group) >= 2,
    );
    return map(filteredGroupedByKind, (group) => {
      const gSize = totalJokers + size(group);
      return {
        group,
        gSize,
        useJokers: gSize - size(group),
      };
    });
  };

  public correctKind = (kind) => {
    switch (kind) {
      case 'jack':
        return 11;
      case 'queen':
        return 12;
      case 'king':
        return 13;
      case 'joker':
        return -1;
      default:
        return toNumber(kind);
    }
  };

  public checkStraight = (cardsData: CardData[]) => {
    const isStraight = !some(cardsData, ({ value }, i) => {
      const prev = clamp(i - 1, 0, size(cardsData) - 1);
      const next = clamp(i + 1, 0, size(cardsData) - 1);

      const prevKind = cardsData[prev]?.value;
      const nextKind = cardsData[next]?.value;
      const curKind = value;
      const isPrevCorrect = prev == i ? true : prevKind === curKind - 1;
      const isNextCorrect = next == i ? true : nextKind === curKind + 1;
      return !isPrevCorrect || !isNextCorrect;
    });
    return isStraight;
  };
  //Co, ro, chuon, bich
  public getFlush = (cardsData: CardData[], totalJokers: number) => {
    //Group by kind
    const groupedBySuit = groupBy(cardsData, 'suit');
    const filteredGroupedBySuit = filter(groupedBySuit, (group) => {
      const groupSize = totalJokers + size(group);
      if (groupSize >= 5) {
        return group;
      }
    });
    return filteredGroupedBySuit;
  };

  // const ALL_SUITS = ['of_clubs', 'of_diamonds', 'of_hearts', 'of_spades'];
  // const ALL_JOKER_SUITS = ['black', 'red'];
  // const ALL_KINDS = [
  //   '1',
  //   '2',
  //   '3',
  //   '4',
  //   '5',
  //   '6',
  //   '7',
  //   '8',
  //   '9',
  //   'jack',
  //   'queen',
  //   'king',
  //   'joker',
  // ];
  public enhanceAceCardsData = (cardsData: CardData[]) => {
    const enhancedSet = reduce(
      cardsData,
      (res, card) => {
        if (card?.kind === '1') {
          return concat(res, [
            card,
            {
              ...card,
              value: 14,
            },
          ]);
        }
        return concat(res, card);
      },
      [],
    );
    return sortBy(enhancedSet, ['value']);
  };
  public cleanJokerCardsData = (cardsData: CardData[]) => {
    const jokerFiltered = filter(cardsData, (card) => card.kind !== 'joker');
    return sortBy(jokerFiltered, ['value']);
  };

  public getComboByTotal = (cardsData: CardData[], totalCards: number) => {
    const totalCombos = size(cardsData) - totalCards + 1;
    const allCombos = times(totalCombos, (i) => {
      const combo = times(totalCards, (j) => cardsData[i + j]);
      return combo;
    });
    return allCombos;
  };
  ///[1,2,3,4,5,6,7] => 7 - 5

  public getStraight = (cardsData: CardData[]) => {
    const result = filter(
      reduce(
        cardsData,
        (seq, elem, index, arr) => {
          const prevValue = arr[index - 1]?.value;
          const prevCompareValue = elem?.value - 1;
          const seqId = size(seq) - 1;
          const currentSeq = seq[seqId];
          if (index && prevValue !== prevCompareValue) {
            seq.push([]);
          }
          currentSeq.push(elem);
          return seq;
        },
        [[]],
      ),
      (group) => size(group) >= 5,
    );
  };
  public checkStraightWithJoker = (
    cardsData: CardData[],
    totalJokers: number,
  ) => {
    for (let i = 0; i < totalJokers; i++) {
      const leftCards = 5 - (i + 1);
      const allCombos = this.getComboByTotal(cardsData, leftCards);
      for (let j = 0; j < allCombos.length; j++) {
        const combo = allCombos[j];
        if (!this.checkStraight(combo)) continue;
        const minValCard = minBy(combo, (card) => card?.value);
        const minVal = minValCard?.value;

        const maxValCard = maxBy(combo, (card) => card?.value);
        const maxVal = maxValCard?.value;
        if (maxVal - minVal < 5) {
          return combo;
        }
      }
    }
  };

  public checkResult = (totalCards: number) => {
    // of_clubs', 'of_diamonds', 'of_hearts', 'of_spades'
    // const cardsData = [
    //   {
    //     kind: '9',
    //     suit: 'of_diamonds',
    //     value: 9,
    //   },
    //   {
    //     kind: '9',
    //     suit: 'of_hearts',
    //     value: 9,
    //   },
    //   {
    //     kind: 'queen',
    //     suit: 'of_clubs',
    //     value: 12,
    //   },
    //   {
    //     kind: 'king',
    //     suit: 'of_spades',
    //     value: 13,
    //   },
    //   {
    //     kind: 'joker',
    //     suit: 'black',
    //     value: -1,
    //   },
    // ];
    //1,1,1,1
    //9,J,Q,K
    //J,Q,1
    //1,1,1
    const cardsData = take(this.cardsData, totalCards);
    const cleanedJokerCardsData = this.cleanJokerCardsData(cardsData);

    const enhancedAceCardsData = this.enhanceAceCardsData(
      cleanedJokerCardsData,
    );
    const totalJokers = this.getJokers(cardsData);

    //FiveOfAKind (along with jokers)
    const filteredGroupedByKind = this.filterByKind(
      cleanedJokerCardsData,
      totalJokers,
    );
    const maxKindsGroup = maxBy(filteredGroupedByKind, ({ gSize }) => gSize);
    if (!isEmpty(maxKindsGroup)) {
      const { gSize, group } = maxKindsGroup;
      if (gSize === 5) {
        return {
          withJokers: totalJokers,
          group,
          isFiveOfAKind: true,
        };
      }
    }

    //RoyalFlush
    const allFlush = this.getFlush(enhancedAceCardsData, totalJokers);
    const royalFlushGroup = find(allFlush, (group) =>
      this.checkStraight(group),
    );
    if (royalFlushGroup) {
      const isRoyalFlush = last(royalFlushGroup).value === 14;

      return {
        withJokers: totalJokers,
        group: royalFlushGroup,
        ...(isRoyalFlush ? { isRoyalFlush: true } : { isStraightFlush: true }),
      };
    }

    //RoyalFlushWithJoker
    let royalFlushWithJoker;
    const isRoyalFlushWithJoker = some(allFlush, (flushGroup) => {
      const foundSet = this.checkStraightWithJoker(flushGroup, totalJokers);
      if (foundSet) {
        royalFlushWithJoker = foundSet;
        return true;
      }
      return false;
    });
    if (isRoyalFlushWithJoker) {
      const isRoyalFlush = last(royalFlushWithJoker).value === 14;
      return {
        withJokers: totalJokers,
        group: royalFlushWithJoker,
        ...(isRoyalFlush ? { isRoyalFlush: true } : { isStraightFlush: true }),
      };
    }

    //FourOfAKind (along with jokers)
    if (!isEmpty(maxKindsGroup)) {
      const { gSize, group } = maxKindsGroup;
      if (gSize === 4) {
        return {
          withJokers: totalJokers,
          group,
          isFourOfAKind: true,
        };
      }
    }

    //FullHouse
    const threeKindGroup = filter(filteredGroupedByKind, { gSize: 3 });
    const twoKindGroup = filter(filteredGroupedByKind, { gSize: 2 });
    if (!isEmpty(filteredGroupedByKind)) {
      for (let i = 0; i < size(threeKindGroup) - 1; i++) {
        const set1 = threeKindGroup[i];
        for (let j = i + 1; j < size(threeKindGroup); j++) {
          const set2 = threeKindGroup[j];
          const totalGSize = set1.gSize + set2.gSize;
          const leftSize = totalGSize - 5;
          const totalUseJokers = set1.useJokers + set2.useJokers - leftSize;
          if (totalGSize >= 5 && totalUseJokers <= totalJokers) {
            return {
              withJokers: totalUseJokers,
              group: concat(set1?.group, set2?.group),
              isFullHouse: true,
            };
          }
        }
      }
      for (let i = 0; i < size(threeKindGroup); i++) {
        const set1 = threeKindGroup[i];
        for (let j = 0; j < size(twoKindGroup); j++) {
          const set2 = twoKindGroup[j];
          const totalGSize = set1.gSize + set2.gSize;
          const leftSize = totalGSize - 5;
          const totalUseJokers = set1.useJokers + set2.useJokers - leftSize;
          if (totalGSize >= 5 && totalUseJokers <= totalJokers) {
            return {
              withJokers: totalUseJokers,
              group: concat(set1?.group, set2?.group),
              isFullHouse: true,
            };
          }
        }
      }
    }

    //Flush
    const allNoEnhancedAceFlush = this.getFlush(
      cleanedJokerCardsData,
      totalJokers,
    );
    if (!isEmpty(allNoEnhancedAceFlush)) {
      const group = allNoEnhancedAceFlush[0];
      return {
        withJokers: clamp(5 - size(group), 0, 999),
        group: group,
        isFlush: true,
      };
    }

    //Straight
    const allStraightCombos = this.getComboByTotal(enhancedAceCardsData, 5);

    for (let i = 0; i < size(allStraightCombos); i++) {
      const combo = allStraightCombos[i];
      const isStraight = this.checkStraight(combo);
      if (isStraight) {
        return {
          withJokers: 0,
          isStraight,
          group: combo,
        };
      }
    }

    //StraightWithJoker
    const straightWithJokerSet = this.checkStraightWithJoker(
      enhancedAceCardsData,
      totalJokers,
    );
    if (straightWithJokerSet) {
      return {
        group: straightWithJokerSet,
        withJokers: 5 - size(straightWithJokerSet),
        isStraight: true,
      };
    }

    //ThreeOfAKind and TwoOfAKind
    if (!isEmpty(filteredGroupedByKind)) {
      if (!isEmpty(threeKindGroup)) {
        const set = threeKindGroup[0];
        return {
          isThreeOfAKind: true,
          group: set?.group,
          withJokers: set?.useJokers,
        };
      }

      if (!isEmpty(twoKindGroup)) {
        const set = twoKindGroup[0];
        return {
          isTwoOfAKind: true,
          group: set?.group,
          withJokers: set?.useJokers,
        };
      }
    }
  };
}

export default CardsService;
