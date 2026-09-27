import { create } from 'zustand';

export const useStore = create((set, get) => ({
  currentUser: {
    id: 'usr-1',
    name: 'You (Alex)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },

  activeTab: 'groups', // 'groups' | 'friends' | 'activity' | 'simplify'

  groups: [
    {
      id: 'grp-1',
      name: 'Kyoto Autumn Expedition',
      category: 'Trip',
      banner: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      members: [
        { id: 'usr-1', name: 'You (Alex)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-2', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-3', name: 'Liam Cooper', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' }
      ],
      totalSpent: 1420
    },
    {
      id: 'grp-2',
      name: 'Modern Loft Flatmates',
      category: 'Home & Utilities',
      banner: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      members: [
        { id: 'usr-1', name: 'You (Alex)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-4', name: 'Sophia Jenkins', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' }
      ],
      totalSpent: 860
    }
  ],

  expenses: [
    {
      id: 'exp-101',
      groupId: 'grp-1',
      title: 'Traditional Ryokan Dinner & Sake Tasting',
      paidBy: 'You (Alex)',
      amount: 360,
      splitType: 'Equal Split',
      date: '2026-09-25',
      category: 'Dining'
    },
    {
      id: 'exp-102',
      groupId: 'grp-1',
      title: 'Bullet Train Passes (Kyoto to Tokyo)',
      paidBy: 'Maya Lin',
      amount: 450,
      splitType: 'Equal Split',
      date: '2026-09-24',
      category: 'Transport'
    },
    {
      id: 'exp-103',
      groupId: 'grp-2',
      title: 'Gigabit Fiber Internet & Water Utility',
      paidBy: 'You (Alex)',
      amount: 140,
      splitType: 'Equal Split',
      date: '2026-09-20',
      category: 'Utilities'
    }
  ],

  simplifiedDebts: [
    { from: 'Liam Cooper', to: 'You (Alex)', amount: 120, status: 'Pending' },
    { from: 'You (Alex)', to: 'Maya Lin', amount: 30, status: 'Pending' },
    { from: 'Sophia Jenkins', to: 'You (Alex)', amount: 70, status: 'Pending' }
  ],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  addExpense: (expData) => set((state) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      groupId: expData.groupId || 'grp-1',
      title: expData.title,
      paidBy: expData.paidBy || 'You (Alex)',
      amount: Number(expData.amount || 0),
      splitType: expData.splitType || 'Equal Split',
      date: new Date().toISOString().slice(0, 10),
      category: expData.category || 'General'
    };

    const updatedGroups = state.groups.map(g =>
      g.id === newExp.groupId ? { ...g, totalSpent: g.totalSpent + newExp.amount } : g
    );

    return {
      expenses: [newExp, ...state.expenses],
      groups: updatedGroups
    };
  }),

  settleDebt: (debtIndex) => set((state) => ({
    simplifiedDebts: state.simplifiedDebts.map((d, idx) =>
      idx === debtIndex ? { ...d, status: 'Settled ✓' } : d
    )
  })),

  addGroup: (grpData) => set((state) => {
    const newGrp = {
      id: `grp-${Date.now()}`,
      name: grpData.name,
      category: grpData.category || 'Trip',
      banner: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      members: [
        state.currentUser,
        { id: `usr-${Date.now()}`, name: grpData.friendName || 'Taylor Morgan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
      ],
      totalSpent: 0
    };
    return { groups: [newGrp, ...state.groups] };
  })
}));
