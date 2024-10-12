"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const res = await fetch('/api/predictions');
      const data = await res.json();
      setPredictions(data);
    };

    if (session) {
      fetchPredictions();
    }
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            {predictions.length > 0 ? (
              <ul>
                {predictions.map((prediction: any) => (
                  <li key={prediction.id}>{prediction.matchId}: {prediction.prediction}</li>
                ))}
              </ul>
            ) : (
              <p>No predictions yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Make a Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/predictions/new')}>New Prediction</Button>
          </CardContent>
        </Card>
        {session?.user?.role === 'ADMIN' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/admin')}>Go to Admin Panel</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}