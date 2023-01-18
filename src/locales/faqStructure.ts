const faqOrder = {
  xch: [
    'questions-about-flexpool/xch-how-to-join-flexpool-chia-pool.md',
    'questions-about-flexpool/multi-what-is-minimum-payout.md',
    'questions-about-flexpool/multi-flexpool-pool-fee.md',
    'questions-about-flexpool/multi-what-reward-scheme.md',
    'questions-about-flexpool/xch-what-software-do-i-need.md',
    'questions-about-flexpool/xch-do-i-have-to-make-new-plots-for-flexpool-or-flex-farmer.md',
    'questions-about-flexpool/xch-how-many-chia-do-i-get-for-x-tb-of-plots.md',
    'questions-about-flexpool/xch-how-are-rewards-calculated-what-if-i-find-a-block.md',
    'questions-about-flexpool/xch-what-address-do-i-use-on-the-flexpool-website-to-see-my-dashboard.md',
    'questions-about-flexpool/xch-why-doesn-t-my-dashboard-show-up-yet-i-get-the-404-moon-page.md',
    'questions-about-flexpool/xch-why-do-i-have-a-lot-of-stale-partials-on-the-dashboard.md',
    'questions-about-flexpool/xch-why-doesn-t-the-pool-show-the-exact-space-i-have-on-my-farm.md',
    'questions-about-flexpool/xch-it-s-been-an-hour-and-my-unpaid-balance-hasn-t-changed.md',
    'questions-about-flexpool/xch-i-m-having-problems-with-my-farm-how-can-i-get-help.md',
    'questions-about-flexpool/xch-why-does-my-gui-show-current-difficulty-of-1-and-current-points-balance-of-9999.md',
    'questions-about-flexpool/xch-how-can-i-transfer-unpaid-balance-to-another-account.md',
    'questions-about-flexpool/xch-how-do-i-change-to-a-different-pool-server-for-my-chia-farm.md',
    'questions-about-flexpool/multi-no-longer-mining.md',
  ],
  etc: [
    'questions-about-flexpool/multi-how-to-join.md',
    'questions-about-flexpool/multi-what-is-minimum-payout.md',
    'questions-about-flexpool/multi-flexpool-pool-fee.md',
    'questions-about-flexpool/etc-i-mined-a-block.md',
    'questions-about-flexpool/etc-what-is-payout-criteria.md',
    'questions-about-flexpool/etc-should-i-use-ssl.md',
    'questions-about-flexpool/multi-when-do-payouts-happen.md',
    'questions-about-flexpool/multi-how-long-will-i-receive-payout.md',
    'questions-about-flexpool/multi-what-reward-scheme.md',
    'questions-about-flexpool/multi-does-flexpool-have-transaction-fees.md',
    'questions-about-flexpool/multi-does-flexpool-send-weekly-payouts-regardless-of-balance.md',
    'questions-about-flexpool/multi-how-unstable-reported-hashrate-effect-my-payouts.md',
    'questions-about-flexpool/multi-why-do-i-have-unstable-reported-hashrate.md',
    'questions-about-flexpool/multi-how-share-count-calculated.md',
    'questions-about-flexpool/multi-my-exchange-has-changed-my-address-how-do-i-fix-this-on-flexpool.md',
    'questions-about-flexpool/multi-my-payout-is-confirmed-on-the-blockchain-but-it-is-not-on-my-wallet.md',
    'questions-about-flexpool/multi-i-ve-lost-my-keys-mnemonics.md',
    'questions-about-flexpool/multi-what-happens-inactive-worker.md',
    'questions-about-flexpool/multi-is-your-live-support-24-7.md',
    'questions-about-flexpool/multi-no-longer-mining.md',
  ],
};

export const faqOrderCompareFn = (coin: string) => {
  return (a: string, b: string) => {
    const ordering = faqOrder[coin];

    if (ordering) {
      const aIndex = ordering.indexOf(a);
      const bIndex = ordering.indexOf(b);

      if (aIndex === -1 || bIndex === -1) {
        return 1;
      }

      return aIndex - bIndex;
    }
    return 0;
  };
};

export const faqStructure = [
  {
    sectionName: 'faq.questionsAboutFlexpool',
    contents: [
      'questions-about-flexpool/multi-how-to-join.md',
      'questions-about-flexpool/multi-what-is-minimum-payout.md',
      'questions-about-flexpool/multi-flexpool-pool-fee.md',
      'questions-about-flexpool/multi-when-do-payouts-happen.md',
      'questions-about-flexpool/multi-how-long-will-i-receive-payout.md',
      'questions-about-flexpool/multi-what-reward-scheme.md',
      'questions-about-flexpool/multi-does-flexpool-have-transaction-fees.md',
      'questions-about-flexpool/multi-does-flexpool-send-weekly-payouts-regardless-of-balance.md',
      'questions-about-flexpool/multi-how-unstable-reported-hashrate-effect-my-payouts.md',
      'questions-about-flexpool/multi-why-do-i-have-unstable-reported-hashrate.md',
      'questions-about-flexpool/multi-how-share-count-calculated.md',
      'questions-about-flexpool/multi-my-exchange-has-changed-my-address-how-do-i-fix-this-on-flexpool.md',
      'questions-about-flexpool/multi-my-payout-is-confirmed-on-the-blockchain-but-it-is-not-on-my-wallet.md',
      'questions-about-flexpool/multi-i-ve-lost-my-keys-mnemonics.md',
      'questions-about-flexpool/multi-what-happens-inactive-worker.md',
      'questions-about-flexpool/multi-is-your-live-support-24-7.md',
      'questions-about-flexpool/multi-no-longer-mining.md',

      // ETC
      'questions-about-flexpool/etc-what-is-payout-criteria.md',
      'questions-about-flexpool/etc-should-i-use-ssl.md',
      'questions-about-flexpool/etc-i-mined-a-block.md',

      // XCH
      'questions-about-flexpool/xch-how-to-join-flexpool-chia-pool.md',
      'questions-about-flexpool/xch-what-software-do-i-need.md',
      'questions-about-flexpool/xch-do-i-have-to-make-new-plots-for-flexpool-or-flex-farmer.md',
      'questions-about-flexpool/xch-how-many-chia-do-i-get-for-x-tb-of-plots.md',
      'questions-about-flexpool/xch-how-are-rewards-calculated-what-if-i-find-a-block.md',
      'questions-about-flexpool/xch-what-address-do-i-use-on-the-flexpool-website-to-see-my-dashboard.md',
      'questions-about-flexpool/xch-why-doesn-t-my-dashboard-show-up-yet-i-get-the-404-moon-page.md',
      'questions-about-flexpool/xch-why-do-i-have-a-lot-of-stale-partials-on-the-dashboard.md',
      'questions-about-flexpool/xch-why-doesn-t-the-pool-show-the-exact-space-i-have-on-my-farm.md',
      'questions-about-flexpool/xch-it-s-been-an-hour-and-my-unpaid-balance-hasn-t-changed.md',
      'questions-about-flexpool/xch-i-m-having-problems-with-my-farm-how-can-i-get-help.md',
      'questions-about-flexpool/xch-why-does-my-gui-show-current-difficulty-of-1-and-current-points-balance-of-9999.md',
      'questions-about-flexpool/xch-how-can-i-transfer-unpaid-balance-to-another-account.md',
      'questions-about-flexpool/xch-how-do-i-change-to-a-different-pool-server-for-my-chia-farm.md',
    ],
  },
  {
    sectionName: 'faq.miningBasics',
    contents: [
      'mining-theory/what-is-hashrate.md',
      'mining-theory/what-is-a-share.md',
      'mining-theory/what-are-stale-shares.md',
      'mining-theory/what-is-a-block.md',
      'mining-theory/the-basics-of-mining-theory.md',
      'mining-theory/what-is-share-difficulty.md',
    ],
  },
];
