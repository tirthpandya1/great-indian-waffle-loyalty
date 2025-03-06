// Mock user data for development purposes
const mockUserData = {
  profile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2024-12-15',
    tier: 'Gold',
    avatar: 'https://i.pravatar.cc/150?img=68'
  },
  loyalty: {
    points: 750,
    totalVisits: 12,
    nextReward: 1000,
    progress: 75 // percentage to next reward
  },
  coupons: [
    {
      id: 'coupon-001',
      title: 'Free Belgian Waffle',
      description: 'Get a free Belgian waffle with any purchase',
      expiryDate: '2025-04-15',
      isUsed: false,
      code: 'BELG2025'
    },
    {
      id: 'coupon-002',
      title: '50% Off Dessert Waffle',
      description: 'Half price on any dessert waffle',
      expiryDate: '2025-03-30',
      isUsed: false,
      code: 'SWEET50'
    },
    {
      id: 'coupon-003',
      title: 'Buy 1 Get 1 Free',
      description: 'Buy one savory waffle, get one free',
      expiryDate: '2025-05-01',
      isUsed: false,
      code: 'BOGO25'
    }
  ],
  recentTransactions: [
    {
      id: 'tx-001',
      date: '2025-03-01',
      amount: 350,
      points: 35,
      items: ['Chocolate Waffle', 'Coffee']
    },
    {
      id: 'tx-002',
      date: '2025-02-15',
      amount: 520,
      points: 52,
      items: ['Savory Waffle Combo', 'Orange Juice']
    },
    {
      id: 'tx-003',
      date: '2025-01-28',
      amount: 420,
      points: 42,
      items: ['Belgian Waffle', 'Ice Cream Scoop', 'Iced Tea']
    }
  ]
};

module.exports = mockUserData;
