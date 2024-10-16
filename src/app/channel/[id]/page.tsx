"use client"

import { useEffect, useState } from 'react';

interface ChannelPageProps {
  params: { id: string };
}

const ChannelPage = ({ params }: ChannelPageProps) => {
  const { id } = params;
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the channel details from your API using the 'id'
      fetch(`/api/channels/${id}`)
        .then((response) => response.json())
        .then((data) => setChannel(data));
    }
  }, [id]);

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h1>Channel #{id}</h1>
      {/* <h1>{channel.name}</h1> */}
      {/* Additional channel details */}
    </div>
  );
};

export default ChannelPage;