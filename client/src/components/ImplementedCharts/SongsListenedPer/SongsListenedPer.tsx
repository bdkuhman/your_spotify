import React from 'react';
import { api } from '../../../services/api';
import { useAPI } from '../../../services/hooks';
import { buildXYData, useFormatXAxis } from '../../../services/stats';
import { DateId } from '../../../services/types';
import ChartCard from '../../ChartCard';
import Line from '../../charts/Line';
import LoadingImplementedChart from '../LoadingImplementedChart';
import { ImplementedChartProps } from '../types';

interface SongsListenedPerProps extends ImplementedChartProps {}

export default function SongsListenedPer({ className, interval }: SongsListenedPerProps) {
  const result = useAPI(api.songsPer, interval.start, interval.end, interval.timesplit);

  const data = buildXYData(
    result?.map((r) => ({
      _id: r._id as DateId,
      value: r.count,
    })) ?? [],
    interval.start,
    interval.end,
  );

  const formatX = useFormatXAxis(data, interval.start, interval.end);

  if (!result) {
    return <LoadingImplementedChart />;
  }

  if (result.length > 0 && result[0]._id == null) {
    return null;
  }

  return (
    <ChartCard title="Songs listened" className={className}>
      <Line data={data} xFormat={formatX} />
    </ChartCard>
  );
}
