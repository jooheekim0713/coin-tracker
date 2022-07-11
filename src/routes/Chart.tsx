import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ApexChart from 'react-apexcharts';

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: number;
  volume: string;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(['ohlcv', coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        'loading chart'
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: 'Price',
              data: data?.map((price) => price.close) as number[],
            },
          ]}
          options={{
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                  reset: false,
                },
              },
              background: 'transparent',
            },
            xaxis: {
              labels: { show: false },
              axisTicks: { show: false },
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toLocaleDateString('ko')
              ),
            },
            theme: {
              mode: 'dark',
            },
            stroke: { curve: 'smooth', width: 3 },
            tooltip: { y: { formatter: (value) => `$ ${value.toFixed(2)}` } },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
