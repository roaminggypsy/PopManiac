import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Table';
import Container from '@material-ui/core/Container';
import { ResponsiveBar } from '@nivo/bar';

const axios = require('axios');

export default function Billboard() {
  const [hot100, setHot100] = useState([]);

  useEffect(() => {
    axios
      .get('/billboardHot100')
      .then(function (response) {
        setHot100(response.data);
      })
      .catch(function (error) {})
      .then(function () {});
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rank',
        disableSortBy: true,
      },
      {
        Header: 'Track',
        accessor: 'track',
        disableSortBy: true,
      },
      {
        Header: 'Artist',
        accessor: 'artist',
        disableSortBy: true,
      },
      {
        Header: 'Last Week',
        accessor: 'lastWeek',
        disableSortBy: true,
      },
      {
        Header: 'Peak',
        accessor: 'peak',
        disableSortBy: true,
      },
      {
        Header: 'Week',
        accessor: 'week',
        disableSortBy: true,
      },
    ],
    []
  );

  const data = [
    {
      country: 'AD',
      'hot dog': 149,
      'hot dogColor': 'hsl(242, 70%, 50%)',
      burger: 182,
      burgerColor: 'hsl(240, 70%, 50%)',
      sandwich: 81,
      sandwichColor: 'hsl(250, 70%, 50%)',
      kebab: 11,
      kebabColor: 'hsl(208, 70%, 50%)',
      fries: 160,
      friesColor: 'hsl(140, 70%, 50%)',
      donut: 148,
      donutColor: 'hsl(323, 70%, 50%)',
    },
    {
      country: 'AE',
      'hot dog': 43,
      'hot dogColor': 'hsl(346, 70%, 50%)',
      burger: 116,
      burgerColor: 'hsl(115, 70%, 50%)',
      sandwich: 30,
      sandwichColor: 'hsl(181, 70%, 50%)',
      kebab: 131,
      kebabColor: 'hsl(351, 70%, 50%)',
      fries: 99,
      friesColor: 'hsl(58, 70%, 50%)',
      donut: 150,
      donutColor: 'hsl(84, 70%, 50%)',
    },
    {
      country: 'AF',
      'hot dog': 144,
      'hot dogColor': 'hsl(116, 70%, 50%)',
      burger: 150,
      burgerColor: 'hsl(192, 70%, 50%)',
      sandwich: 83,
      sandwichColor: 'hsl(88, 70%, 50%)',
      kebab: 150,
      kebabColor: 'hsl(70, 70%, 50%)',
      fries: 173,
      friesColor: 'hsl(275, 70%, 50%)',
      donut: 21,
      donutColor: 'hsl(330, 70%, 50%)',
    },
    {
      country: 'AG',
      'hot dog': 184,
      'hot dogColor': 'hsl(108, 70%, 50%)',
      burger: 131,
      burgerColor: 'hsl(16, 70%, 50%)',
      sandwich: 146,
      sandwichColor: 'hsl(211, 70%, 50%)',
      kebab: 158,
      kebabColor: 'hsl(201, 70%, 50%)',
      fries: 194,
      friesColor: 'hsl(16, 70%, 50%)',
      donut: 187,
      donutColor: 'hsl(328, 70%, 50%)',
    },
    {
      country: 'AI',
      'hot dog': 19,
      'hot dogColor': 'hsl(28, 70%, 50%)',
      burger: 140,
      burgerColor: 'hsl(41, 70%, 50%)',
      sandwich: 150,
      sandwichColor: 'hsl(326, 70%, 50%)',
      kebab: 172,
      kebabColor: 'hsl(16, 70%, 50%)',
      fries: 150,
      friesColor: 'hsl(160, 70%, 50%)',
      donut: 193,
      donutColor: 'hsl(101, 70%, 50%)',
    },
    {
      country: 'AL',
      'hot dog': 9,
      'hot dogColor': 'hsl(14, 70%, 50%)',
      burger: 25,
      burgerColor: 'hsl(197, 70%, 50%)',
      sandwich: 0,
      sandwichColor: 'hsl(1, 70%, 50%)',
      kebab: 199,
      kebabColor: 'hsl(67, 70%, 50%)',
      fries: 141,
      friesColor: 'hsl(124, 70%, 50%)',
      donut: 62,
      donutColor: 'hsl(124, 70%, 50%)',
    },
    {
      country: 'AM',
      'hot dog': 32,
      'hot dogColor': 'hsl(170, 70%, 50%)',
      burger: 103,
      burgerColor: 'hsl(339, 70%, 50%)',
      sandwich: 78,
      sandwichColor: 'hsl(39, 70%, 50%)',
      kebab: 157,
      kebabColor: 'hsl(30, 70%, 50%)',
      fries: 150,
      friesColor: 'hsl(176, 70%, 50%)',
      donut: 183,
      donutColor: 'hsl(344, 70%, 50%)',
    },
  ];

  const MyResponsiveBar = ({ data /* see data tab */ }) => (
    <ResponsiveBar
      data={data}
      keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
      indexBy='country'
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'fries',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'sandwich',
          },
          id: 'lines',
        },
      ]}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'country',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'food',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );

  const hot100Data = useMemo(() => hot100, [hot100]);

  return (
    <Container>
      <Table columns={columns} data={hot100Data} />
      <div style={{ height: '300px' }}>
        <MyResponsiveBar data={data} />
      </div>
    </Container>
  );
}
