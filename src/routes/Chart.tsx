import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atom';

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

interface IChartAxis {
  x: Date;
  y: number[];
}

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(['ohlcv', coinId], () =>
    fetchCoinHistory(coinId)
  );

  return (
    <div>
      {isLoading ? (
        'loading chart'
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              name: 'Price',
              data: data?.map((props) => {
                return {
                  x: new Date(props.time_open * 1000),
                  y: [
                    parseFloat(props.open),
                    parseFloat(props.high),
                    parseFloat(props.low),
                    parseFloat(props.close),
                  ],
                };
              }) as IChartAxis[],
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
              type: 'datetime',
            },
            yaxis: { show: false },
            theme: {
              mode: isDark ? 'dark' : 'light',
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
