"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewPrediction() {
  const [matchId, setMatchId] = useState('');
  const [prediction, setPrediction] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchId, prediction }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      console.error('Failed to create prediction');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Prediction</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="matchId" className="block text-sm font-medium text-gray-700">Match ID</label>
          <Input
            type="text"
            id="matchId"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="prediction" className="block text-sm font-medium text-gray-700">Prediction</label>
          <Select onValueChange={setPrediction} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your prediction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home Win</SelectItem>
              <SelectItem value="away">Away Win</SelectItem>
              <SelectItem value="draw">Draw</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Submit Prediction</Button>
      </form>
    </div>
  );
}