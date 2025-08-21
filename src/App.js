// src/App.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import NFTGrid from './components/NFTGrid';
import CampaignForm from './app/features/CampaignForm';
import CampaignDetail from './app/features/CampaignDetail';

function App() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [currentView, setCurrentView] = useState('form');
  
  const campaigns = useSelector(state => state.campaign.campaigns);
  const currentCampaign = useSelector(state => state.campaign.currentCampaign);

  const collections = [
    { id: 1, name: 'Art Collection', nfts: [{ id: 1, name: 'NFT 1', image: 'https://via.placeholder.com/200' }] },
    { id: 2, name: 'Music Collection', nfts: [{ id: 2, name: 'NFT 2', image: 'https://via.placeholder.com/200' }] },
  ];

  const handleCampaignComplete = () => {
    setCurrentView('detail');
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      <Header
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
        collections={collections}
      />

      {currentView === 'form' ? (
        <>
          <CampaignForm onComplete={handleCampaignComplete} />
          <NFTGrid nfts={collections.find(c => c.id === selectedCollection)?.nfts || []} />
        </>
      ) : (
        <CampaignDetail campaign={currentCampaign} />
      )}
    </div>
  );
}

export default App;