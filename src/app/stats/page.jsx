import React from 'react';
import Card from '@/components/statsCard';
import { card } from '@/constants';

const Stats = () => {
  const cards = [];
  for (let i = 0; i < card.length; i++) {
    cards.push(
      <Card
        key={i}
        title={card[i].title}
        link={card[i].link}
      />
    );
  }

  return (
    <div className="container mx-auto ml-12 mt-12 mb-8 grid gap-1 sm:gap-8 grid-cols-2">
      {cards}
    </div>
  );
};

export default Stats;