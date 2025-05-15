'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import SubscriptionTable from '@/components/SubscriptionTable';
import SubscriptionPieChart from '@/components/SubscriptionPieChart';

export default function ReportsPage() {
  const { currentUser } = useAuth();

  const [allSubs, setAllSubs] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!currentUser?.uid) return;

      const q = query(
        collection(db, 'subscriptions'),
        where('userId', '==', currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllSubs(results);
    };

    fetchSubscriptions();
  }, [currentUser]);

  useEffect(() => {
    let subs = [...allSubs];

    if (categoryFilter !== 'All') {
      subs = subs.filter(sub => sub.category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      subs = subs.filter(sub => sub.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      subs = subs.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubs(subs);
  }, [allSubs, categoryFilter, statusFilter, searchTerm]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Filtered Reports</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {['All', 'Streaming', 'Music', 'Web Services', 'Fitness', 'Other'].map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="border p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {['All', 'Active', 'Paused', 'Cancelled'].map(status => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <input
          className="border p-2 flex-1"
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <SubscriptionPieChart subscriptions={filteredSubs} />
      <SubscriptionTable subscriptions={filteredSubs} />
    </main>
  );
}
